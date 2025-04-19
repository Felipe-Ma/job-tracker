from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database import SessionLocal
from models import JobApplication

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
