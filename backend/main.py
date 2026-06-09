import asyncio
import logging
import os

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import List, Optional

from app.db.session import get_async_session, engine
from app.db.config import get_database_config, redact_database_url
from app.modules.base import Base
from app.modules.task import Task
from app.modules.user import User
from app.schemas.task import TaskCreate, Task as TaskSchema, TaskUpdate, DeleteTasksRequest
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.auth import get_current_user
from app.routes.auth import router as auth_router
from app.core.supabase import supabase
from app.telegram_bot.bot import build_application
from app.telegram_bot.scheduler import run_reminder_scheduler

app = FastAPI(title="Mirandi Todo API")
logger = logging.getLogger("uvicorn.error")

_tg_app = None
_scheduler_task = None

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:5173/login",
    "http://localhost:5173/register",
    "http://localhost:5174",  # Vite fallback
    "http://localhost:5174/login",
    "http://localhost:5174/register",
    "http://localhost:3000",  # React default
]

# Supabase settings
SUPABASE_TABLE_NAME = os.getenv("SUPABASE_TABLE_NAME", "tasks")
SUPABASE_INCLUDE_TELEGRAM_ID = os.getenv("SUPABASE_INCLUDE_TELEGRAM_ID", "false").strip().lower() in {
    "1",
    "true",
    "yes",
    "on",
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.on_event("startup")
async def startup():
    global _tg_app, _scheduler_task

    database_config = get_database_config()
    redacted_url = redact_database_url(database_config.url)
    try:
        async with engine.begin() as conn:
            if database_config.url.startswith("postgresql"):
                result = await conn.execute(
                    text(
                        "SELECT 1 FROM information_schema.columns "
                        "WHERE table_name = 'tasks' AND column_name = 'updated_at'"
                    )
                )
                if result.first() is None:
                    await conn.execute(
                        text(
                            "ALTER TABLE tasks "
                            "ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now()"
                        )
                    )
                    logger.info("Added missing column tasks.updated_at")
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database connection OK: %s", redacted_url)
        if supabase:
            logger.info("Supabase client configured for API sync.")
        else:
            logger.warning("Supabase client not configured; API sync disabled.")
    except Exception:
        logger.exception("Database startup failed using %s", redacted_url)
        raise

    token = os.getenv("TELEGRAM_TOKEN")
    if token:
        try:
            _tg_app = build_application(token)
            await _tg_app.initialize()
            await _tg_app.start()
            await _tg_app.updater.start_polling(drop_pending_updates=True)
            _scheduler_task = asyncio.create_task(
                run_reminder_scheduler(_tg_app.bot)
            )
            logger.info("Telegram bot started in polling mode.")
        except Exception:
            logger.exception("Failed to start Telegram bot.")
    else:
        logger.warning("TELEGRAM_TOKEN not set; Telegram bot disabled.")


@app.on_event("shutdown")
async def shutdown():
    global _tg_app, _scheduler_task

    if _scheduler_task:
        _scheduler_task.cancel()
        try:
            await _scheduler_task
        except asyncio.CancelledError:
            pass

    if _tg_app:
        try:
            await _tg_app.updater.stop()
            await _tg_app.stop()
            await _tg_app.shutdown()
            logger.info("Telegram bot stopped.")
        except Exception:
            logger.exception("Error stopping Telegram bot.")

@app.get("/")
async def root():
    return {"message": "Mirandi Todo API is running"}

@app.post("/register", response_model=UserSchema)
async def register(
    response: Response,
    user: UserCreate, 
    db: AsyncSession = Depends(get_async_session)
):
    result = await db.execute(select(User).where(User.email == user.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(
        username=user.username,
        email=user.email,
        password=get_password_hash(user.password)
    )
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
    except Exception as e:
        await db.rollback()
        logger.exception("Failed to create user email=%s", user.email)
        raise HTTPException(status_code=500, detail=str(e))

    if supabase:
        try:
            supabase.table("users").insert({
                "id": db_user.id,
                "username": db_user.username,
                "email": db_user.email,
            }).execute()
        except Exception:
            logger.exception("Failed to sync user id=%s to Supabase", db_user.id)

    # Automatically log in the user by setting the access token cookie
    access_token = create_access_token(subject=db_user.email)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
        path="/",
    )

    return db_user

@app.post("/login", response_model=Token)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_session),
):
    # form_data.username is actually email in our case if we use email as identifier
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.email)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24 * 7,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"message": "Logged out successfully"}

@app.get("/users/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/tasks/", response_model=TaskSchema)
async def create_task(
    task: TaskCreate, 
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    # Now tasks are automatically linked to the logged-in user
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        remainded=task.remainded,
        reminder_time=task.reminder_time,
        user_id=current_user.id
    )
    db.add(db_task)
    try:
        await db.commit()
        await db.refresh(db_task)
        logger.info("Task created successfully: %s \n \n \n \n " , db_task)
        # Sync with Supabase if configured
        if supabase:
            try:
                logger.info("Syncing task id=%s to Supabase API", db_task.id)
                # We need to serialize the datetime objects to string
                task_data = {
                    "id": db_task.id,
                    "title": db_task.title,
                    "description": db_task.description,
                    "completed": db_task.completed,
                    "remainded": db_task.remainded,
                    "user_id": db_task.user_id,
                    "reminder_time": db_task.reminder_time.isoformat() if db_task.reminder_time else None,
                }
                if SUPABASE_INCLUDE_TELEGRAM_ID and current_user.telegram_id:
                    task_data["telegram_id"] = current_user.telegram_id
                
                # If using the anon key, RLS policies must allow insertion
                result = supabase.table(SUPABASE_TABLE_NAME).insert(task_data).execute()
                if getattr(result, "error", None):
                    raise RuntimeError(result.error)
            except Exception as e:
                # Log error but don't fail the request since local DB is primary
                logger.exception(
                    "Failed to sync task to Supabase table '%s': %s",
                    SUPABASE_TABLE_NAME,
                    e,
                )
        else:
            logger.warning("Supabase client not configured; skipping API sync.")
                
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return db_task

@app.get("/tasks/", response_model=List[TaskSchema])
async def read_tasks(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    # Only return tasks belonging to the current user
    result = await db.execute(
        select(Task).where(Task.user_id == current_user.id).offset(skip).limit(limit)
    )
    tasks = result.scalars().all()
    return list(tasks)

@app.put("/tasks/{task_id}", response_model=TaskSchema)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    db_task = result.scalar_one_or_none()
    
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if "title" in task_update.model_fields_set:
        db_task.title = task_update.title
    if "description" in task_update.model_fields_set:
        db_task.description = task_update.description
    if "completed" in task_update.model_fields_set:
        db_task.completed = task_update.completed
    if "remainded" in task_update.model_fields_set:
        db_task.remainded = task_update.remainded
    if "reminder_time" in task_update.model_fields_set:
        db_task.reminder_time = task_update.reminder_time
    
    try:
        await db.commit()
        await db.refresh(db_task)
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return db_task

@app.delete("/tasks/{task_id}", response_model=TaskSchema)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.user_id == current_user.id)
    )
    db_task = result.scalar_one_or_none()
    
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
        
    try:
        await db.delete(db_task)
        await db.commit()
        
        if supabase:
            try:
                result = supabase.table(SUPABASE_TABLE_NAME).delete().eq("id", task_id).execute()
                if getattr(result, "error", None):
                    raise RuntimeError(result.error)
            except Exception as e:
                logger.exception(
                    "Failed to delete task id=%s from Supabase table '%s': %s",
                    task_id,
                    SUPABASE_TABLE_NAME,
                    e,
                )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return db_task

@app.post("/tasks/delete", response_model=List[int])
async def delete_tasks_post(
    payload: DeleteTasksRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    return await handle_bulk_delete(payload.task_ids, db, current_user)

@app.delete("/tasks", response_model=List[int])
async def delete_tasks_delete(
    payload: DeleteTasksRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    return await handle_bulk_delete(payload.task_ids, db, current_user)

async def handle_bulk_delete(
    task_ids: List[int],
    db: AsyncSession,
    current_user: User
) -> List[int]:
    if not task_ids:
        return []
        
    result = await db.execute(
        select(Task).where(Task.id.in_(task_ids), Task.user_id == current_user.id)
    )
    db_tasks = result.scalars().all()
    
    if not db_tasks:
        return []
        
    actual_deleted_ids = [t.id for t in db_tasks]
    
    try:
        for db_task in db_tasks:
            await db.delete(db_task)
        await db.commit()
        
        if supabase:
            try:
                result = supabase.table(SUPABASE_TABLE_NAME).delete().in_("id", actual_deleted_ids).execute()
                if getattr(result, "error", None):
                    raise RuntimeError(result.error)
            except Exception as e:
                logger.exception(
                    "Failed to delete tasks %s from Supabase table '%s': %s",
                    actual_deleted_ids,
                    SUPABASE_TABLE_NAME,
                    e,
                )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return actual_deleted_ids


