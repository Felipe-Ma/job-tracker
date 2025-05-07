from sqlalchemy import Column, Integer, String, Date, Text, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base

# This is the base class that all models will extend
Base = declarative_base()

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    date_applied = Column(Date, nullable=True)
    resume_used = Column(String(255), nullable=True)
    contact_info = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    stage = Column(String(50), default="Applied")
    salary = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
