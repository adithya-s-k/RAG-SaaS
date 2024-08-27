# import re
# import os
# import json
# from motor.motor_asyncio import AsyncIOMotorClient
# from dotenv import load_dotenv
# from app.models.user_model import User
# from app.core.security import get_password

# load_dotenv()

# MONGODB_URI = os.getenv("MONGODB_URI")
# MONGODB_NAME = os.getenv("MONGODB_NAME", "RAGSAAS")
# ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
# ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
# ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")  # Add this line

# CONFIG_FILE = "rag_config.json"


# class MongoDB:
#     client: AsyncIOMotorClient = None
#     db = None

#     async def connect_to_database(self):
#         self.client = AsyncIOMotorClient(MONGODB_URI)
#         self.db = self.client[MONGODB_NAME]
#         print("Connected to MongoDB")

#     async def close_database_connection(self):
#         if self.client:
#             self.client.close()
#             print("Closed MongoDB connection")

#     async def database_init(self):
#         users_collection = self.db.users
#         config_collection = self.db.config

#         # Create admin user if not exists
#         existing_user = await users_collection.find_one({"email": ADMIN_EMAIL})
#         if not existing_user:
#             admin_user = User(
#                 first_name=ADMIN_USERNAME,
#                 last_name=ADMIN_USERNAME,
#                 email=ADMIN_EMAIL,
#                 hashed_password=get_password(ADMIN_PASSWORD),
#                 role="admin",
#             )
#             await users_collection.insert_one(admin_user.to_mongo())
#             print(f"Admin user created with email: {ADMIN_EMAIL}")

#         # Check if config already exists
#         existing_config = await config_collection.find_one({"_id": "app_config"})
#         if existing_config:
#             print("Configuration already exists. Skipping initialization.")
#             return

#         # Initialize system prompt and conversation starters
#         system_prompt = os.getenv("SYSTEM_PROMPT", "")
#         conversation_starters_raw = os.getenv("CONVERSATION_STARTERS", "")

#         # Split conversation starters by both newlines and commas
#         conversation_starters = re.split(r"[,\n]+", conversation_starters_raw)
#         # Clean up any extra whitespace and remove empty strings
#         conversation_starters = [
#             starter.strip() for starter in conversation_starters if starter.strip()
#         ]

#         initial_config = {
#             "SYSTEM_PROMPT": system_prompt,
#             "CONVERSATION_STARTERS": conversation_starters,
#         }

#         # Insert new config in database
#         await config_collection.insert_one({"_id": "app_config", **initial_config})

#         # Save config to file
#         with open(CONFIG_FILE, "w") as f:
#             json.dump(initial_config, f, indent=2)

#         print("System prompt and conversation starters initialized")
#         print(f"Conversation starters: {conversation_starters}")


# mongodb = MongoDB()

import re
import os
import json
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from dotenv import load_dotenv
from app.models.user_model import User
from app.core.security import get_password

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_NAME = os.getenv("MONGODB_NAME", "RAGSAAS")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")

CONFIG_FILE = "rag_config.json"


class AsyncMongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        self.client = AsyncIOMotorClient(MONGODB_URI)
        self.db = self.client[MONGODB_NAME]
        print("Connected to MongoDB (Async)")

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
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client[MONGODB_NAME]
        print("Connected to MongoDB (Sync)")

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
