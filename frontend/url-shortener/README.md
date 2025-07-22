# URL Shortener Frontend

This is a React-based frontend for the URL shortener API.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Admin Panel**: Manage shortened URLs using the admin secret key
- **Authentication**: User registration and login (ready for backend integration)
- **Statistics**: View click counts for shortened URLs
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure the API endpoint in `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm start
```

The app will run on http://localhost:3000

## Usage

### Shortening URLs
1. Enter a long URL in the input field
2. Click "Shorten URL"  
3. Copy the shortened URL or admin URL

### Admin Panel
1. Navigate to the Admin Panel
2. Enter the secret key from your admin URL
3. View statistics or delete the URL

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── AdminPanel.tsx
│   ├── Navigation.tsx
│   ├── ProtectedRoute.tsx
│   └── URLShortener.tsx
├── contexts/
│   └── AuthContext.tsx
├── services/
│   └── api.ts
├── App.tsx
├── App.css
└── index.tsx
```

## Build for Production

```bash
npm run build
```

The build files will be in the `build` directory.

## Technologies Used

- React with TypeScript
- React Router for navigation
- Axios for API calls
- CSS for styling

## Note on Authentication

The authentication components are ready but require backend endpoints to be implemented:
- `/token` - Login endpoint
- `/register` - Registration endpoint

Currently, the app works without authentication for basic URL shortening functionality.