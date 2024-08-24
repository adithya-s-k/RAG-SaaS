import os
from typing import Any
from dotenv import load_dotenv
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection

load_dotenv()

class MongoDBConnection:
    def __init__(self, collection_name: str):
        self.uri = os.getenv("MONGODB_URI")
        if not self.uri:
            raise ValueError("MONGODB_URI not found in .env file")
        
        self.database_name = os.getenv("MONGODB_DATABASE", "RAGSAAS")
        self.collection_name = collection_name
        self.sync_client = None
        self.async_client = None

    def get_sync_collection(self) -> Any:
        if not self.sync_client:
            self.sync_client = MongoClient(self.uri)
        db = self.sync_client[self.database_name]
        return db[self.collection_name]

    def get_async_collection(self) -> AsyncIOMotorCollection:
        if not self.async_client:
            self.async_client = AsyncIOMotorClient(self.uri)
        db = self.async_client[self.database_name]
        return db[self.collection_name]

    def sync_operation(self, operation: str, *args, **kwargs) -> Any:
        collection = self.get_sync_collection()
        return getattr(collection, operation)(*args, **kwargs)

    async def async_operation(self, operation: str, *args, **kwargs) -> Any:
        collection = self.get_async_collection()
        return await getattr(collection, operation)(*args, **kwargs)

mongodb = MongoDBConnection()

def get_user_collection():
    return mongodb.get_async_collection("users")

def get_conversation_collection():
    return mongodb.get_async_collection("conversations")

# Usage example
# if __name__ == "__main__":
#     # Initialize the connection
#     mongo = MongoDBConnection("your_collection")

#     # Synchronous operation example
#     sync_result = mongo.sync_operation("find_one", {"key": "value"})
#     print("Sync result:", sync_result)

#     # Asynchronous operation example
#     import asyncio

#     async def async_example():
#         async_result = await mongo.async_operation("find_one", {"key": "value"})
#         print("Async result:", async_result)

#     asyncio.run(async_example())