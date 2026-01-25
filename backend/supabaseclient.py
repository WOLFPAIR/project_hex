from supabase import create_client, Client
from datetime import datetime, timezone

SUPABASE_URL = "https://bcxgwzokszscbfxwsthy.supabase.co"
SUPABASE_API = "sb_publishable_wBXRWGCpf_X8czDRZf6mkw_3XPqP65i"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_API)

task = {
    "id": 1,
    "title": "Lab 1",
    "description": "Supabase + Python SDK",
    "completed": False,
    "reminder_time": datetime(2026, 1, 20, 10, 0, tzinfo=timezone.utc).isoformat(),
    "telegram_id": 123456789,
    "user_id": 1,
    "is_notified": False
}

result = supabase.table("tasks").insert(task).execute()

print(result.data)
