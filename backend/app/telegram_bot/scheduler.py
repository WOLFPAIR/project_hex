from __future__ import annotations

import asyncio
import logging
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload

from app.db.session import AsyncSessionLocal
from app.modules.task import Task
from app.modules.user import User

logger = logging.getLogger("telegram_scheduler")


async def run_reminder_scheduler(bot) -> None:
    logger.info("Reminder scheduler started.")
    while True:
        await asyncio.sleep(60)
        try:
            async with AsyncSessionLocal() as session:
                result = await session.execute(
                    select(Task)
                    .options(selectinload(Task.user))
                    .join(Task.user)
                    .where(
                        and_(
                            Task.reminder_time <= func.now(),
                            Task.completed == False,
                            Task.remainded == False,
                            User.telegram_id.isnot(None),
                        )
                    )
                )
                due_tasks = result.scalars().all()

                for task in due_tasks:
                    try:
                        await bot.send_message(
                            chat_id=task.user.telegram_id,
                            text=(
                                f"Напоминание о задаче:\n"
                                f"{task.title}"
                                + (f"\n\n{task.description}" if task.description else "")
                            ),
                        )
                        task.remainded = True
                        logger.info("Reminder sent for task_id=%s", task.id)
                    except Exception:
                        logger.exception(
                            "Failed to send reminder for task_id=%s", task.id
                        )

                if due_tasks:
                    await session.commit()

        except asyncio.CancelledError:
            logger.info("Reminder scheduler stopped.")
            raise
        except Exception:
            logger.exception("Reminder scheduler tick failed")
