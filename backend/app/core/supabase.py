from __future__ import annotations
import os
from supabase import create_client, Client

def get_supabase_client() -> Client | None:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_API")
    
    if not url or not key:
        return None
        
    return create_client(url, key)

supabase: Client | None = get_supabase_client()
