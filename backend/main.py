from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal
from models import JobApplication

from schemas import JobApplicationCreate, JobApplicationOut

app = FastAPI()

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
        new_job = JobApplication(**job.dict()) # Create a new job application instance
        db.add(new_job) # Add the new job application to the session
        db.commit() # Commit the session to save the new job application
        db.refresh(new_job) # Refresh the instance to get the new ID and other defaults
        return new_job # Return the new job application
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")