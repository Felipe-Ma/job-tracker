from sqlalchemy import Column, Integer, String, Date, Text, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base

# This is the base class that all models will extend
Base = declarative_base()

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    location = Column(String(255))
    date_applied = Column(Date)
    resume_used = Column(String(255))
    contact_info = Column(Text)
    notes = Column(Text)
    stage = Column(String(50), default="Applied")
    created_at = Column(TIMESTAMP, server_default=func.now())
