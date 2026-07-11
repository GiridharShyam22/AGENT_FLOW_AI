import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

async def test():
    try:
        client = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        print("MongoDB is running and reachable!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        sys.exit(1)

asyncio.run(test())
