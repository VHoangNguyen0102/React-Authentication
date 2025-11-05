# Frontend README

## Overview

React frontend application with JWT authentication, built with Vite and styled with Tailwind CSS.

## Features

- React 18 with modern hooks
- React Router v6 for routing
- Axios with automatic token refresh interceptors
- React Query for server state management
- React Hook Form for form handling
- Tailwind CSS for styling
- Toast notifications
- Protected routes
- Role-based access control

## Project Structure

```
src/
├── api/              # API configuration
│   ├── axios.js      # Axios instance with interceptors
│   └── index.js      # API endpoints
├── components/       # Reusable components
│   └── ProtectedRoute.jsx
├── hooks/            # Custom React hooks
│   └── useAuth.js    # Authentication hooks
├── pages/            # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── AdminPanel.jsx
├── App.jsx           # Main app with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Key Components

### Authentication Flow

- **Login Page**: Form with validation using React Hook Form
- **Protected Routes**: Wrapper component checking authentication
- **Axios Interceptors**: Automatic token attachment and refresh
- **React Query Hooks**: Managing authentication state

### Token Management

- Access tokens stored in memory (secure)
- Refresh tokens stored in localStorage (persistent)
- Automatic refresh on 401 errors
- Token clearing on logout

## Deployment

### Netlify

```bash
npm run build
netlify deploy --prod
```

### Vercel

```bash
vercel --prod
```

Update `VITE_API_URL` in production environment variables to point to your deployed backend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
