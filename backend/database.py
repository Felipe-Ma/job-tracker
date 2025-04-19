from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# PostgreSQL connection URL - this matches the Docker setup
DATABASE_URL = "postgresql://felipe:devpass@localhost:5432/jobtracker_db"

# Create SQLAlchemy enginer and session factory
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)