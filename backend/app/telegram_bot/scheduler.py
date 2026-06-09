from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.task import Task
from app.modules.user import User
from app.core.supabase import supabase

logger = logging.getLogger("telegram_scheduler")


async def run_reminder_scheduler(bot) -> None:
    logger.info("Reminder scheduler started (direct Supabase polling).")
    while True:
        try:
            if supabase:
                # 1. Fetch users with a telegram_id from Supabase
                users_res = supabase.table("users").select("id, telegram_id").not_.is_("telegram_id", "null").execute()
                if getattr(users_res, "error", None):
                    logger.error("Failed to fetch users from Supabase: %s", users_res.error)
                else:
                    user_telegram_map = {u["id"]: u["telegram_id"] for u in users_res.data if u.get("telegram_id")}
                    if user_telegram_map:
                        # 2. Fetch active tasks with reminder_time from Supabase
                        now_iso = datetime.now(timezone.utc).isoformat()
                        tasks_res = supabase.table("tasks").select("*").eq("completed", False).eq("remainded", False).not_.is_("reminder_time", "null").lte("reminder_time", now_iso).execute()
                        if getattr(tasks_res, "error", None):
                            logger.error("Failed to fetch tasks from Supabase: %s", tasks_res.error)
                        else:
                            due_tasks = tasks_res.data
                            for task in due_tasks:
                                task_id = task["id"]
                                user_id = task["user_id"]
                                telegram_id = user_telegram_map.get(user_id)
                                
                                if telegram_id:
                                    try:
                                        # Send telegram message
                                        await bot.send_message(
                                            chat_id=telegram_id,
                                            text=(
                                                f"Напоминание о задаче:\n"
                                                f"{task['title']}"
                                                + (f"\n\n{task['description']}" if task.get('description') else "")
                                            ),
                                        )
                                        logger.info("Reminder sent for task_id=%s to telegram_id=%s", task_id, telegram_id)

                                        # Update remainded = True in Supabase
                                        supabase.table("tasks").update({"remainded": True}).eq("id", task_id).execute()

                                        # Update local database
                                        async with AsyncSessionLocal() as session:
                                            db_task = await session.get(Task, task_id)
                                            if db_task:
                                                db_task.remainded = True
                                                await session.commit()
                                                logger.info("Updated task_id=%s locally", task_id)
                                    except Exception:
                                        logger.exception(
                                            "Failed to send reminder for task_id=%s", task_id
                                        )
            else:
                logger.warning("Supabase client is not configured; skipping scheduler tick.")

        except asyncio.CancelledError:
            logger.info("Reminder scheduler stopped.")
            raise
        except Exception:
            logger.exception("Reminder scheduler tick failed")
        
        await asyncio.sleep(60)

