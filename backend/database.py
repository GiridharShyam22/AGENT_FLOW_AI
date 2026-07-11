from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logger = logging.getLogger(__name__)

DB_NAME = os.getenv("MONGO_DB_NAME", "agentflow_db")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_config = Database()

async def connect_to_mongo():
    # Read env var at connection time (not module load time) so Render env vars are available
    MONGO_URI = os.getenv("MONGO_URL", os.getenv("MONGO_URI", "mongodb://localhost:27017"))
    logger.info(f"Connecting to MongoDB with URI prefix: {MONGO_URI[:20]}...")
    try:
        db_config.client = AsyncIOMotorClient(
            MONGO_URI,
            serverSelectionTimeoutMS=10000,  # 10 second timeout
            connectTimeoutMS=10000,
        )
        db_config.db = db_config.client[DB_NAME]
        # Force a real connection to verify it works
        await db_config.client.admin.command("ping")
        logger.info("✅ Connected to MongoDB!")
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    logger.info("Closing MongoDB connection...")
    if db_config.client:
        db_config.client.close()
    logger.info("MongoDB connection closed.")

def get_db():
    if db_config.db is None:
        raise RuntimeError("Database not connected. Check MONGO_URL environment variable on Render.")
    return db_config.db
