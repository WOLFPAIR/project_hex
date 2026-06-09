from __future__ import annotations

from telegram.ext import Application, CommandHandler, CallbackQueryHandler

from app.telegram_bot.handlers import start_handler, tasks_handler, add_handler, accounts_handler, accounts_callback_handler


def build_application(token: str) -> Application:
    app = Application.builder().token(token).build()
    app.add_handler(CommandHandler("start", start_handler))
    app.add_handler(CommandHandler("tasks", tasks_handler))
    app.add_handler(CommandHandler("add", add_handler))
    app.add_handler(CommandHandler("accounts", accounts_handler))
    app.add_handler(CallbackQueryHandler(accounts_callback_handler))
    return app
