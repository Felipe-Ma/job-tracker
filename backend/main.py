from fastapi import FastAPI, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
import os
from pathlib import Path
from datetime import datetime


from database import SessionLocal, engine
from models import JobApplication, Base

from schemas import JobApplicationCreate, JobApplicationOut, JobApplicationUpdate

app = FastAPI()

# Directory to store uploaded resumes
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Job Tracker API is running 🚀"}

@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    try:
        jobs = db.query(JobApplication).all()
        return jobs
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/jobs", response_model=JobApplicationOut)
def create_job(job: JobApplicationCreate, db: Session = Depends(get_db)):
    try:
        job_data = job.dict()
        if job_data.get("date_applied") is None:
            job_data["date_applied"] = datetime.utcnow().date()
        new_job = JobApplication(**job_data)
        db.add(new_job)
        db.commit()
        db.refresh(new_job)
        return new_job
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@app.get("/jobs/{job_id}", response_model=JobApplicationOut)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/jobs/{job_id}", response_model=JobApplicationOut)
def update_job(job_id: int, update_data: JobApplicationUpdate, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"message": f"Job with ID {job_id} has been deleted"}

from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/jobs/{job_id}/upload_resume")
async def upload_resume(
    job_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Check if the job exists
    job = db.query(JobApplication).filter(JobApplication.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # 2. Save the uploaded file
    file_extension = file.filename.split(".")[-1]
    safe_filename = f"{job_id}_resume.{file_extension}"
    file_path = UPLOAD_DIR / safe_filename

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 3. Update the resume_used field in the database
    job.resume_used = safe_filename
    db.commit()
    db.refresh(job)

    return {"message": "Resume uploaded successfully", "file_path": str(file_path)}

    

