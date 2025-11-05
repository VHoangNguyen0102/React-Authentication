# Backend README

## Overview

Express.js backend server implementing JWT authentication with access and refresh tokens.

## Features

- JWT access tokens (15-minute expiry)
- JWT refresh tokens (7-day expiry)
- Protected routes with authentication middleware
- Role-based access control
- Password hashing with bcryptjs
- CORS enabled for frontend communication

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate refresh token

### User Routes (`/api/user`)

- `GET /api/user/profile` - Get user profile (protected)
- `GET /api/user/dashboard` - Get dashboard data (protected)
- `GET /api/user/admin` - Get admin data (protected, admin only)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`

3. Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Environment Variables

See `.env.example` for all available configuration options.

## Demo Users

```javascript
// Regular User
{
  email: 'demo@example.com',
  password: 'demo123',
  role: 'user'
}

// Admin User
{
  email: 'admin@example.com',
  password: 'demo123',
  role: 'admin'
}
```

## Security Notes

- Change JWT secrets before deploying to production
- Use strong, randomly generated secrets (at least 64 characters)
- Enable HTTPS in production
- Consider using Redis for refresh token storage
- Implement rate limiting for production use
