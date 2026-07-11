from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URL", os.getenv("MONGO_URI", "mongodb://localhost:27017"))
DB_NAME = os.getenv("MONGO_DB_NAME", "agentflow_db")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    db_config.client = AsyncIOMotorClient(MONGO_URI)
    db_config.db = db_config.client[DB_NAME]
    logger.info("Connected to MongoDB!")

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_config.client:
        db_config.client.close()
    logger.info("MongoDB connection closed.")

def get_db():
    return db_config.db
