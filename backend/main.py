from fastapi import FastAPI, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware


from database import SessionLocal
from models import JobApplication

from schemas import JobApplicationCreate, JobApplicationOut, JobApplicationUpdate

app = FastAPI()
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
        new_job = JobApplication(**job.dict()) # Create a new job application instance
        db.add(new_job) # Add the new job application to the session
        db.commit() # Commit the session to save the new job application
        db.refresh(new_job) # Refresh the instance to get the new ID and other defaults
        return new_job # Return the new job application
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

    

