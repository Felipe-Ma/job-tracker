from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobApplicationCreate(BaseModel):
    company_name: str
    job_title: str
    location: Optional[str] = None
    date_applied: Optional[datetime] = None
    resume_used: Optional[str] = None
    contact_info: Optional[str] = None
    notes: Optional[str] = None
    stage: Optional[str] = "Applied"

class JobApplicationOut(JobApplicationCreate):
    id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True 