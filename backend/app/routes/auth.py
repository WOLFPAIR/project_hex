from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.modules.user import User
from app.schemas.user import User as UserSchema

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=UserSchema)
async def read_auth_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
