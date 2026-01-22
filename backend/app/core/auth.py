from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import ALGORITHM, SECRET_KEY
from app.db.session import get_async_session
from app.modules.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    token: str | None = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    cookie_token = request.cookies.get("access_token")
    raw_token = cookie_token or token
    if not raw_token:
        raise credentials_exception

    if raw_token.startswith("Bearer "):
        raw_token = raw_token[7:]

    try:
        payload = jwt.decode(raw_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
