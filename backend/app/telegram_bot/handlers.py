from __future__ import annotations

import logging
import os
from telegram import Update
from telegram.ext import ContextTypes
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.user import User
from app.modules.task import Task
from app.core.supabase import supabase

logger = logging.getLogger("telegram_handlers")


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
            await update.message.reply_text("Этот аккаунт уже привязан к твоему Telegram.")
            return

        user.telegram_id = telegram_id
        await session.commit()

    if supabase:
        try:
            supabase.table("users").upsert({"id": user_id, "telegram_id": telegram_id}).execute()
        except Exception:
            logger.exception("Failed to sync telegram_id to Supabase for user_id=%s", user_id)

    await update.message.reply_text(
        f"Аккаунт успешно привязан! Теперь ты будешь получать напоминания о задачах.\n"
        f"Используй /tasks для просмотра задач или /add <название> для создания новой."
    )


async def tasks_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    telegram_id = str(update.effective_user.id)

    async with AsyncSessionLocal() as session:
        user_result = await session.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        user = user_result.scalar_one_or_none()

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
        await update.message.reply_text("У тебя нет активных задач.")
        return

    lines = ["Твои активные задачи:\n"]
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
        user_result = await session.execute(
            select(User).where(User.telegram_id == telegram_id)
        )
        user = user_result.scalar_one_or_none()

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

    await update.message.reply_text(f'Задача создана: "{title}" (id={task_id})')
