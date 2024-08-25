import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from app.models.user_model import User
from app.core.security import get_password

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_NAME = os.getenv("MONGODB_NAME", "RAGSAAS")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")  # Add this line


class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_database(self):
        self.client = AsyncIOMotorClient(MONGODB_URI)
        self.db = self.client[MONGODB_NAME]
        print("Connected to MongoDB")

    async def close_database_connection(self):
        if self.client:
            self.client.close()
            print("Closed MongoDB connection")

    async def create_admin_user(self):
        users_collection = self.db.users
        existing_user = await users_collection.find_one({"email": ADMIN_EMAIL})
        if not existing_user:
            admin_user = User(
                username=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                hashed_password=get_password(ADMIN_PASSWORD),
                role="admin",
            )
            await users_collection.insert_one(admin_user.to_mongo())
            print(f"Admin user created with email: {ADMIN_EMAIL}")


mongodb = MongoDB()
