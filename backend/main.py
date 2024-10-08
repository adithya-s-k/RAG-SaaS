# flake8: noqa: E402
from dotenv import load_dotenv

from app.config import DATA_DIR

load_dotenv()

import logging
import os
import json

import uvicorn

from app.api.chat import chat_router
from app.api.chat import config_router
from app.api.chat import file_upload_router
from app.api.auth import auth_router
from app.api.conversation import conversation_router
from app.api.admin import admin_router
from app.observability import init_observability
from app.settings import init_settings
from app.db import async_mongodb, sync_mongodb

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await async_mongodb.connect_to_database()
    sync_mongodb.connect_to_database()
    await async_mongodb.database_init()
    yield
    # Shutdown: Close the database connection
    sync_mongodb.close_database_connection()
    await async_mongodb.close_database_connection()


app = FastAPI(lifespan=lifespan)

init_settings()
init_observability()

environment = os.getenv("ENVIRONMENT", "dev")  # Default to 'development' if not set
logger = logging.getLogger("uvicorn")

# if environment == "dev":
#     logger.warning("Running in development mode - allowing CORS for all origins")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Redirect to documentation page when accessing base URL
@app.get("/")
async def redirect_to_docs():
    return RedirectResponse(url="/docs")


def mount_static_files(directory, path):
    if os.path.exists(directory):
        logger.info(f"Mounting static files '{directory}' at '{path}'")
        app.mount(
            path,
            StaticFiles(directory=directory, check_dir=False),
            name=f"{directory}-static",
        )


# Mount the data files to serve the file viewer
mount_static_files(DATA_DIR, "/api/files/data")
# Mount the output files from tools
mount_static_files("output", "/api/files/output")

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])
app.include_router(config_router, prefix="/api/chat/config", tags=["Chat"])
app.include_router(file_upload_router, prefix="/api/chat/upload", tags=["Chat"])
app.include_router(
    conversation_router, prefix="/api/conversation", tags=["Conversation"]
)
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])

if __name__ == "__main__":
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "8000"))
    reload = True if environment == "dev" else False

    uvicorn.run(app="main:app", host=app_host, port=app_port, reload=reload)
