from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, users_router, discussions_router, blogs_router, comments_router
from app.database import engine, Base
from app.models import * 

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SolveHub API",
    description="Backend API for SolveHub application",
    version="1.0.0"
)

# CORS middleware - MUST be configured BEFORE routes
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(discussions_router)
app.include_router(blogs_router)
app.include_router(comments_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SolveHub API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)