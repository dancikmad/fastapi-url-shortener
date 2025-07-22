# URL Shortener API

A high-performance URL shortening service built with FastAPI and PostgreSQL.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Click Tracking**: Monitor the number of clicks on each shortened URL
- **Admin Interface**: Manage shortened URLs with secret keys
- **Async Support**: Built with async/await for optimal performance
- **Database Support**: PostgreSQL for production, SQLite for development
- **CORS Enabled**: Ready for frontend integration
- **Docker Support**: Easy deployment with Docker Compose

## Tech Stack

- **Framework**: FastAPI 0.75.0
- **Database**: PostgreSQL (production) / SQLite (development)
- **ORM**: SQLAlchemy with async support
- **Server**: Uvicorn
- **Containerization**: Docker & Docker Compose
- **Python**: 3.10+

## API Endpoints

### 1. Create Short URL
- **POST** `/url`
- **Request Body**:
  ```json
  {
    "target_url": "https://example.com/very-long-url"
  }
  ```
- **Response**:
  ```json
  {
    "target_url": "https://example.com/very-long-url",
    "key": "abc123",
    "secret_key": "secret_xyz",
    "url": "http://localhost:8000/abc123",
    "admin": "http://localhost:8000/admin/secret_xyz",
    "clicks": 0,
    "is_active": true
  }
  ```

### 2. Redirect to Target URL
- **GET** `/{url_key}`
- Redirects to the original URL and increments click count

### 3. Get URL Information
- **GET** `/admin/{secret_key}`
- Returns detailed information about the shortened URL

### 4. Delete URL
- **DELETE** `/admin/{secret_key}`
- Deactivates the shortened URL

### 5. Health Check
- **GET** `/`
- Returns welcome message

## Installation

### Prerequisites
- Python 3.10+
- PostgreSQL (for production)
- Docker & Docker Compose (optional)

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vk-7cac-documentat
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # or if using uv:
   uv sync
   ```

4. Create `.env` file:
   ```env
   DATABASE_URL=sqlite+aiosqlite:///./shortener.db
   BASE_URL=http://localhost:8000
   DB_USER=postgres
   DB_PASS=yourpassword
   DB_NAME=shortener
   ```

5. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

### Docker Deployment

1. Create `.env` file with production settings:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@shortener_app_db:5432/shortener
   BASE_URL=https://yourdomain.com
   DB_USER=postgres
   DB_PASS=yourpassword
   DB_NAME=shortener
   ```

2. Build and run with Docker Compose:
   ```bash
   docker-compose up -d
   ```

The API will be available at `http://localhost:8000`

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── config.py          # Application configuration
│   ├── database.py        # Database connection and session management
│   ├── exceptions.py      # Custom exception handlers
│   ├── main.py           # FastAPI application and routes
│   ├── dao/
│   │   └── base.py       # Base DAO class
│   └── urls/
│       ├── __init__.py
│       ├── dao.py        # URL data access operations
│       ├── keygen.py     # Key generation utilities
│       ├── models.py     # SQLAlchemy models
│       └── schemas.py    # Pydantic schemas
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | Required |
| `BASE_URL` | Base URL for shortened links | Required |
| `DB_USER` | PostgreSQL username | postgres |
| `DB_PASS` | PostgreSQL password | Required |
| `DB_NAME` | PostgreSQL database name | shortener |

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
ruff format .
```

### Linting
```bash
ruff check .
```

## API Usage Examples

### Create a Short URL
```bash
curl -X POST "http://localhost:8000/url" \
  -H "Content-Type: application/json" \
  -d '{"target_url": "https://www.example.com/very-long-url"}'
```

### Get URL Information
```bash
curl "http://localhost:8000/admin/{secret_key}"
```

### Delete a URL
```bash
curl -X DELETE "http://localhost:8000/admin/{secret_key}"
```

## Security Considerations

- Secret keys are generated for each URL to prevent unauthorized access
- CORS is configured (currently allows all origins - restrict in production)
- Input validation ensures only valid URLs are shortened
- Database queries use parameterized statements to prevent SQL injection

## Performance

- Asynchronous request handling with FastAPI
- Connection pooling with SQLAlchemy
- Efficient database queries with proper indexing
- Docker multi-stage builds for optimized images

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]