# SolveHub Backend

This is the backend API for SolveHub application built with FastAPI, SQLAlchemy ORM, and MySQL.

## Features

- User registration and authentication
- JWT token-based authentication
- Password hashing with bcrypt
- MySQL database integration
- Database migrations with Alembic
- CORS support for frontend integration

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: Python SQL toolkit and ORM
- **MySQL**: Relational database
- **Alembic**: Database migration tool
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing

## Setup

### Prerequisites

- Python 3.8+
- MySQL server
- pip (Python package manager)

### Installation

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` file with your database credentials and configuration.

4. Create MySQL database:
```sql
CREATE DATABASE solvehub;
```

5. Run database migrations:
```bash
alembic upgrade head
```

### Running the Application

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get access token

### Users

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `DELETE /users/me` - Deactivate current user account

### General

- `GET /` - Welcome message
- `GET /health` - Health check

## Database Schema

### Users Table

- `id` (Integer, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `full_name` (String)
- `hashed_password` (String)
- `is_active` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── database.py        # Database connection
│   ├── dependencies.py    # FastAPI dependencies
│   ├── models/            # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/           # Pydantic schemas
│   │   ├── __init__.py
│   │   └── user.py
│   ├── crud/              # Database operations
│   │   ├── __init__.py
│   │   └── user.py
│   ├── utils/             # Utility functions
│   │   ├── __init__.py
│   │   └── auth.py
│   └── routers/           # API routes
│       ├── __init__.py
│       ├── auth.py
│       └── users.py
├── alembic/               # Database migrations
├── main.py                # FastAPI application
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
└── alembic.ini           # Alembic configuration
```

## Development

### Creating Database Migrations

```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Testing Authentication

1. Register a new user:
```bash
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "username": "testuser",
       "full_name": "Test User",
       "password": "testpassword"
     }'
```

2. Login to get access token:
```bash
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=test@example.com&password=testpassword"
```

3. Use the token to access protected endpoints:
```bash
curl -X GET "http://localhost:8000/users/me" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Environment Variables

- `DATABASE_URL`: MySQL database connection string
- `SECRET_KEY`: Secret key for JWT token generation
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes
- `ENVIRONMENT`: Application environment (development/production)