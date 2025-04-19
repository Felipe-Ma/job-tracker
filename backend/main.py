from fastapi import FastAPI

app = FastAPI() # Create an instance of FastAPI

@app.get("/") # Define a route for the root URL
def read_root():
    return {"message": "Job tracker API is running!"} # Return a JSON response
