from __future__ import annotations

import logging
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.user import User
from app.modules.task import Task
from app.core.supabase import supabase

logger = logging.getLogger("telegram_handlers")


async def get_active_user(telegram_id: str, context: ContextTypes.DEFAULT_TYPE, session) -> User | None:
    """Helper to get the currently active user for the given telegram chat."""
    result = await session.execute(
        select(User).where(User.telegram_id == telegram_id)
    )
    users = result.scalars().all()
    if not users:
        return None
        
    active_id = context.user_data.get("active_user_id")
    if active_id:
        active_user = next((u for u in users if u.id == active_id), None)
        if active_user:
            return active_user
            
    # Default to first and save
    context.user_data["active_user_id"] = users[0].id
    return users[0]


async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    args = context.args
    if not args:
        await update.message.reply_text(
            "Привет! Отправь /start {user_id} чтобы привязать аккаунт.\n"
            "Твой user_id можно узнать в приложении в профиле."
        )
        return

    try:
        user_id = int(args[0])
    except ValueError:
        await update.message.reply_text("Неверный формат user_id. Ожидается число.")
        return

    telegram_id = str(update.effective_user.id)

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if user is None:
            await update.message.reply_text(f"Пользователь с id={user_id} не найден.")
            return

        if user.telegram_id == telegram_id:
            context.user_data["active_user_id"] = user_id
            await update.message.reply_text(f"Этот аккаунт ({user.username}) уже привязан к твоему Telegram и выбран активным!")
            return

        user.telegram_id = telegram_id
        await session.commit()
        # Refresh user to load attributes
        await session.refresh(user)

    if supabase:
        try:
            supabase.table("users").update({"telegram_id": telegram_id}).eq("id", user_id).execute()
        except Exception:
            logger.exception("Failed to sync telegram_id to Supabase for user_id=%s", user_id)

    context.user_data["active_user_id"] = user_id

    await update.message.reply_text(
        f"Аккаунт {user.username} (ID: {user_id}) успешно привязан и выбран как активный!\n\n"
        f"Используй:\n"
        f"/tasks — просмотр задач активного аккаунта\n"
        f"/add <название> — создание новой задачи\n"
        f"/accounts — переключение и управление вашими аккаунтами"
    )


async def tasks_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    telegram_id = str(update.effective_user.id)

    async with AsyncSessionLocal() as session:
        user = await get_active_user(telegram_id, context, session)

        if user is None:
            await update.message.reply_text(
                "Твой Telegram не привязан к аккаунту.\n"
                "Открой приложение, скопируй свой user_id и отправь: /start {user_id}"
            )
            return

        tasks_result = await session.execute(
            select(Task).where(Task.user_id == user.id, Task.completed == False)
        )
        tasks = tasks_result.scalars().all()

    if not tasks:
        await update.message.reply_text(f"У аккаунта {user.username} (ID: {user.id}) нет активных задач.")
        return

    lines = [f"Твои активные задачи для аккаунта {user.username} (ID: {user.id}):\n"]
    for i, task in enumerate(tasks, 1):
        reminder = ""
        if task.reminder_time:
            reminder = f" ⏰ {task.reminder_time.strftime('%d.%m %H:%M')}"
        lines.append(f"{i}. {task.title}{reminder}")

    await update.message.reply_text("\n".join(lines))


async def add_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    telegram_id = str(update.effective_user.id)

    if not context.args:
        await update.message.reply_text("Использование: /add <название задачи>")
        return

    title = " ".join(context.args)

    async with AsyncSessionLocal() as session:
        user = await get_active_user(telegram_id, context, session)

        if user is None:
            await update.message.reply_text(
                "Твой Telegram не привязан к аккаунту.\n"
                "Открой приложение и отправь: /start {user_id}"
            )
            return

        new_task = Task(title=title, user_id=user.id)
        session.add(new_task)
        await session.commit()
        await session.refresh(new_task)
        task_id = new_task.id

    await update.message.reply_text(f'Задача создана для {user.username} (ID: {user.id}): "{title}" (id={task_id})')


async def accounts_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    telegram_id = str(update.effective_user.id)
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        users = result.scalars().all()
        
    if not users:
        await update.message.reply_text(
            "У вас нет привязанных аккаунтов.\n"
            "Отправьте /start {user_id} чтобы привязать первый аккаунт."
        )
        return
        
    active_id = context.user_data.get("active_user_id")
    if not active_id or not any(u.id == active_id for u in users):
        active_id = users[0].id
        context.user_data["active_user_id"] = active_id
        
    lines = ["👥 Ваши привязанные аккаунты:\n"]
    keyboard = []
    
    for u in users:
        is_active = u.id == active_id
        status = " 🟢 [АКТИВЕН]" if is_active else ""
        lines.append(f"• ID: {u.id} | Имя: {u.username}{status}")
        
        row = []
        if not is_active:
            row.append(
                InlineKeyboardButton(
                    text=f"Выбрать {u.username}", 
                    callback_data=f"switch_{u.id}"
                )
            )
        row.append(
            InlineKeyboardButton(
                text=f"Отвязать {u.username}", 
                callback_data=f"unlink_{u.id}"
            )
        )
        keyboard.append(row)
        
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "\n".join(lines) + "\n\nИспользуйте кнопки ниже для управления:",
        reply_markup=reply_markup
    )


async def accounts_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    
    data = query.data
    telegram_id = str(update.effective_user.id)
    
    if data.startswith("switch_"):
        user_id = int(data.split("_")[1])
        context.user_data["active_user_id"] = user_id
        
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            users = result.scalars().all()
            
        if not users:
            await query.edit_message_text("Привязанных аккаунтов не найдено.")
            return
            
        active_user = next((u for u in users if u.id == user_id), None)
        active_name = active_user.username if active_user else "Неизвестно"
        
        lines = ["👥 Ваши привязанные аккаунты:\n"]
        keyboard = []
        for u in users:
            is_active = u.id == user_id
            status = " 🟢 [АКТИВЕН]" if is_active else ""
            lines.append(f"• ID: {u.id} | Имя: {u.username}{status}")
            
            row = []
            if not is_active:
                row.append(
                    InlineKeyboardButton(
                        text=f"Выбрать {u.username}", 
                        callback_data=f"switch_{u.id}"
                    )
                )
            row.append(
                InlineKeyboardButton(
                    text=f"Отвязать {u.username}", 
                    callback_data=f"unlink_{u.id}"
                )
            )
            keyboard.append(row)
            
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(
            f"✅ Активный аккаунт изменен на: **{active_name}** (ID: {user_id})\n\n" +
            "\n".join(lines) + "\n\nИспользуйте кнопки ниже для управления:",
            reply_markup=reply_markup,
            parse_mode="Markdown"
        )
        
    elif data.startswith("unlink_"):
        user_id = int(data.split("_")[1])
        
        # Unlink user in local DB
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = result.scalar_one_or_none()
            if user:
                user.telegram_id = None
                await session.commit()
                
        # Unlink in Supabase
        if supabase:
            try:
                supabase.table("users").update({"telegram_id": None}).eq("id", user_id).execute()
            except Exception:
                logger.exception("Failed to unlink telegram_id in Supabase for user_id=%s", user_id)
                
        # If the unlinked user was active, clear it from session
        if context.user_data.get("active_user_id") == user_id:
            context.user_data.pop("active_user_id", None)
            
        # Refresh accounts list
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            users = result.scalars().all()
            
        if not users:
            await query.edit_message_text(
                "❌ Вы отвязали все аккаунты.\n"
                "Отправьте /start {user_id} чтобы привязать новый аккаунт."
            )
            return
            
        # Set new active if needed
        active_id = context.user_data.get("active_user_id")
        if not active_id or not any(u.id == active_id for u in users):
            active_id = users[0].id
            context.user_data["active_user_id"] = active_id
            
        lines = ["👥 Ваши привязанные аккаунты:\n"]
        keyboard = []
        for u in users:
            is_active = u.id == active_id
            status = " 🟢 [АКТИВЕН]" if is_active else ""
            lines.append(f"• ID: {u.id} | Имя: {u.username}{status}")
            
            row = []
            if not is_active:
                row.append(
                    InlineKeyboardButton(
                        text=f"Выбрать {u.username}", 
                        callback_data=f"switch_{u.id}"
                    )
                )
            row.append(
                InlineKeyboardButton(
                    text=f"Отвязать {u.username}", 
                    callback_data=f"unlink_{u.id}"
                )
            )
            keyboard.append(row)
            
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(
            f"⚠️ Аккаунт с ID {user_id} успешно отвязан от вашего Telegram.\n\n" +
            "\n".join(lines) + "\n\nИспользуйте кнопки ниже для управления:",
            reply_markup=reply_markup,
            parse_mode="Markdown"
        )
