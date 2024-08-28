import asyncio
import re
import os
import json
import time
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo.errors import ServerSelectionTimeoutError
from app.models.user_model import User
from app.core.security import get_password

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_NAME = os.getenv("MONGODB_NAME", "RAGSAAS")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")

CONFIG_FILE = "rag_config.json"


MAX_RETRIES = 5
RETRY_DELAY = 5


class AsyncMongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        for attempt in range(MAX_RETRIES):
            try:
                print(
                    f"Attempting to connect to MongoDB (Async) - Attempt {attempt + 1}"
                )
                self.client = AsyncIOMotorClient(MONGODB_URI)
                await (
                    self.client.server_info()
                )  # This will raise an exception if it can't connect
                self.db = self.client[MONGODB_NAME]
                print("Connected to MongoDB (Async)")
                return
            except ServerSelectionTimeoutError as e:
                print(f"Connection attempt {attempt + 1} failed: {str(e)}")
                if attempt < MAX_RETRIES - 1:
                    print(f"Retrying in {RETRY_DELAY} seconds...")
                    await asyncio.sleep(RETRY_DELAY)
                else:
                    print("Max retries reached. Unable to connect to MongoDB.")
                    raise

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection (Async)")

    async def database_init(self):
        users_collection = self.db.users
        config_collection = self.db.config

        # Create admin user if not exists
        existing_user = await users_collection.find_one({"email": ADMIN_EMAIL})
        if not existing_user:
            admin_user = User(
                first_name=ADMIN_USERNAME,
                last_name=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                hashed_password=get_password(ADMIN_PASSWORD),
                role="admin",
            )
            await users_collection.insert_one(admin_user.to_mongo())
            print(f"Admin user created with email: {ADMIN_EMAIL}")

        # Check if config already exists
        existing_config = await config_collection.find_one({"_id": "app_config"})
        if existing_config:
            print("Configuration already exists. Skipping initialization.")
            return

        # Initialize system prompt and conversation starters
        system_prompt = os.getenv("SYSTEM_PROMPT", "")
        conversation_starters_raw = os.getenv("CONVERSATION_STARTERS", "")

        conversation_starters = re.split(r"[,\n]+", conversation_starters_raw)
        conversation_starters = [
            starter.strip() for starter in conversation_starters if starter.strip()
        ]

        initial_config = {
            "SYSTEM_PROMPT": system_prompt,
            "CONVERSATION_STARTERS": conversation_starters,
        }

        await config_collection.insert_one({"_id": "app_config", **initial_config})

        with open(CONFIG_FILE, "w") as f:
            json.dump(initial_config, f, indent=2)

        print("System prompt and conversation starters initialized")
        print(f"Conversation starters: {conversation_starters}")


class SyncMongoDB:
    client: MongoClient = None
    db = None

    def connect_to_database(self):
        for attempt in range(MAX_RETRIES):
            try:
                print(
                    f"Attempting to connect to MongoDB (Sync) - Attempt {attempt + 1}"
                )
                self.client = MongoClient(MONGODB_URI)
                self.client.server_info()  # This will raise an exception if it can't connect
                self.db = self.client[MONGODB_NAME]
                print("Connected to MongoDB (Sync)")
                return
            except ServerSelectionTimeoutError as e:
                print(f"Connection attempt {attempt + 1} failed: {str(e)}")
                if attempt < MAX_RETRIES - 1:
                    print(f"Retrying in {RETRY_DELAY} seconds...")
                    time.sleep(RETRY_DELAY)
                else:
                    print("Max retries reached. Unable to connect to MongoDB.")
                    raise

    def close_database_connection(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection (Sync)")

    def database_init(self):
        users_collection = self.db.users
        config_collection = self.db.config

        # Create admin user if not exists
        existing_user = users_collection.find_one({"email": ADMIN_EMAIL})
        if not existing_user:
            admin_user = User(
                first_name=ADMIN_USERNAME,
                last_name=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                hashed_password=get_password(ADMIN_PASSWORD),
                role="admin",
            )
            users_collection.insert_one(admin_user.to_mongo())
            print(f"Admin user created with email: {ADMIN_EMAIL}")

        # Check if config already exists
        existing_config = config_collection.find_one({"_id": "app_config"})
        if existing_config:
            print("Configuration already exists. Skipping initialization.")
            return

        # Initialize system prompt and conversation starters
        system_prompt = os.getenv("SYSTEM_PROMPT", "")
        conversation_starters_raw = os.getenv("CONVERSATION_STARTERS", "")

        conversation_starters = re.split(r"[,\n]+", conversation_starters_raw)
        conversation_starters = [
            starter.strip() for starter in conversation_starters if starter.strip()
        ]

        initial_config = {
            "SYSTEM_PROMPT": system_prompt,
            "CONVERSATION_STARTERS": conversation_starters,
        }

        config_collection.insert_one({"_id": "app_config", **initial_config})

        with open(CONFIG_FILE, "w") as f:
            json.dump(initial_config, f, indent=2)

        print("System prompt and conversation starters initialized")
        print(f"Conversation starters: {conversation_starters}")


async_mongodb = AsyncMongoDB()
sync_mongodb = SyncMongoDB()
