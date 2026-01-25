# Project Hex (Mirandi) — запуск проекта

Проект состоит из:
- **backend**: FastAPI + SQLAlchemy (async) + Alembic
- **frontend**: React + Vite + TypeScript

## Требования
- **Node.js 18+** и npm
- **Python 3.11+**
- (опционально) **Poetry** для удобной установки зависимостей backend
- (опционально) **Docker Desktop**

## Быстрый старт (локально, Windows PowerShell)

### 1) Backend

Перейдите в папку backend:

```powershell
cd .\backend
```

Создайте `.env`:

```powershell
Copy-Item .\.env.example .\.env
```

По умолчанию, если `DATABASE_URL` не задан, backend использует SQLite:
`sqlite+aiosqlite:///./app.db`.

#### Вариант A — через Poetry (рекомендуется)

```powershell
poetry install
poetry run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Вариант B — через venv + pip

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -U pip
pip install poetry
poetry config virtualenvs.create false
poetry install
docker compose up --build
```

Backend будет доступен по адресу:
- `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### 2) Frontend

В новом терминале из корня проекта:

```powershell
cd .\frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:
- `http://localhost:5173`

## Запуск через Docker (только backend)

В корне проекта:

```powershell
docker compose up --build
```

После этого backend будет на `http://localhost:8000`.
Frontend запускается отдельно (см. раздел выше).

## Миграции БД (опционально)

Если хотите применять миграции Alembic:

```powershell
cd .\backend
poetry run alembic upgrade head
```

## Переменные окружения (backend)

Файл: `backend/.env`

Минимально:
- **SECRET_KEY**: строка для подписи токенов/куки
- **ALGORITHM**: обычно `HS256`
- **DATABASE_URL**: (опционально) строка подключения, по умолчанию SQLite

Опционально (если используете Supabase sync):
- **SUPABASE_URL**
- **SUPABASE_API**
тауже нужно использовать n8n 
My workflow (1).json находится в кореневой папке