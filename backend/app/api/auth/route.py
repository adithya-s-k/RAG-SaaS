import logging
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

auth_router = APIRouter()

logger = logging.getLogger("uvicorn")

@auth_router.get("")
def get_user():
  return {"return user"}