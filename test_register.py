import asyncio
from passlib.context import CryptContext
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

async def run():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["agentflow_db"]
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    password = "password123"
    hashed = pwd_context.hash(password)
    
    user_doc = {
        "name": "test",
        "email": "test@test.com",
        "password_hash": hashed,
        "created_at": datetime.utcnow()
    }
    
    await db["users"].insert_one(user_doc)
    print("Inserted!")

asyncio.run(run())
