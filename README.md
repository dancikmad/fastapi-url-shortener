## URL Shortener Project

This project consists of:
- **Backend API**: FastAPI-based URL shortening service
- **Frontend**: React-based web interface

### Backend

The backend is built with FastAPI and provides endpoints for:
- Creating shortened URLs
- Redirecting short URLs to target URLs
- Admin functionality for managing URLs

To run the backend:
```bash
docker-compose up
```

The API will be available at http://localhost:8000

### Frontend

The frontend is located in `frontend/url-shortener/` and provides:
- Web interface for shortening URLs
- Admin panel for managing shortened URLs
- Authentication components (ready for backend integration)

To run the frontend:
```bash
cd frontend/url-shortener
npm install
npm start
```

The frontend will be available at http://localhost:3000

See the frontend README for more details: [frontend/url-shortener/README.md](frontend/url-shortener/README.md)