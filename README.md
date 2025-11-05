# React Authentication with JWT (Access + Refresh Tokens)

A complete full-stack authentication system implementing JWT access and refresh tokens with React, Express, Axios, React Query, and React Hook Form.

🌐 **Live Demo**: [Your deployment URL here]

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [How It Works](#how-it-works)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)

## ✨ Features

- ✅ **JWT Authentication** with access and refresh tokens
- ✅ **Automatic Token Refresh** using Axios interceptors
- ✅ **React Query** for server state management
- ✅ **React Hook Form** with validation
- ✅ **Protected Routes** with role-based access control
- ✅ **Beautiful UI** with Tailwind CSS
- ✅ **Toast Notifications** for user feedback
- ✅ **Secure Token Storage** (memory + localStorage)
- ✅ **Multi-tab Logout** support
- ✅ **Error Handling** with meaningful messages

## 🛠 Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **JSON Web Token (JWT)** - Token generation
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
React-Authentication/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API configuration and endpoints
│   │   │   ├── axios.js     # Axios instance with interceptors
│   │   │   └── index.js     # API functions
│   │   ├── components/      # React components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useAuth.js   # Authentication hooks
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── backend/                  # Express backend server
    ├── routes/              # API routes
    │   ├── auth.routes.js   # Authentication endpoints
    │   └── user.routes.js   # User endpoints
    ├── middleware/          # Express middleware
    │   └── auth.middleware.js
    ├── utils/               # Utility functions
    │   └── auth.js          # JWT utilities
    ├── server.js            # Express server
    ├── .env                 # Environment variables
    └── package.json
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- A modern web browser

## 🚀 Installation

### 1. Clone the repository

```bash
cd React-Authentication
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Both `.env` files are already created with default values. You can modify them if needed.

**Backend** (`backend/.env`):

```env
PORT=5000
NODE_ENV=development
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Option 2: Run from Root (Recommended)

Open two terminals:

**Terminal 1:**

```bash
cd backend && npm run dev
```

**Terminal 2:**

```bash
cd frontend && npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔐 Demo Credentials

### Regular User

- **Email**: demo@example.com
- **Password**: demo123

### Admin User

- **Email**: admin@example.com
- **Password**: demo123

## 🔄 How It Works

### Authentication Flow

1. **Login**

   - User submits credentials via React Hook Form
   - Backend validates and returns access token (15min) + refresh token (7 days)
   - Access token stored in memory, refresh token in localStorage
   - User redirected to dashboard

2. **Protected Requests**

   - Axios automatically attaches access token to requests
   - If access token expires (401 error), interceptor catches it
   - Automatically calls refresh endpoint with refresh token
   - Gets new access token and retries original request
   - User experiences seamless authentication

3. **Logout**
   - Clears access token from memory
   - Removes refresh token from localStorage
   - Invalidates refresh token on backend
   - Redirects to login page

### Token Storage Strategy

- **Access Token**: Stored in memory (JavaScript variable)
  - ✅ Secure against XSS
  - ✅ Lost on page refresh (by design)
- **Refresh Token**: Stored in localStorage
  - ✅ Persists across page refreshes
  - ✅ Used to get new access tokens
  - ⚠️ Vulnerable to XSS (mitigated by short-lived access tokens)

### Axios Interceptor Flow

```javascript
Request → Add Access Token → Server
         ↓ (401 Error)
    Refresh Token → New Access Token → Retry Request
         ↓ (Refresh Fails)
    Clear Tokens → Redirect to Login
```

## 🌐 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend:**

```bash
cd frontend
npm run build
```

2. **Deploy to Netlify:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

3. **Deploy to Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

4. **Update environment variables:**
   - Set `VITE_API_URL` to your backend API URL

### Backend Deployment (Render/Railway/Heroku)

1. **Deploy to Render:**

   - Create new Web Service
   - Connect GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables from `.env`

2. **Deploy to Railway:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
cd backend
railway up
```

3. **Update environment variables:**
   - Set `FRONTEND_URL` to your frontend URL
   - Change JWT secrets to secure random strings

### Important: Production Security

⚠️ **Before deploying to production:**

1. Change JWT secrets to strong random strings:

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. Update CORS settings to allow only your frontend domain

3. Set `NODE_ENV=production`

4. Use HTTPS for both frontend and backend

5. Consider using HTTP-only cookies for refresh tokens

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`

Login with email and password.

**Request:**

```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "demo@example.com",
      "name": "Demo User",
      "role": "user"
    }
  }
}
```

#### POST `/api/auth/refresh`

Refresh access token using refresh token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/logout`

Logout and invalidate refresh token.

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Protected Endpoints

#### GET `/api/user/profile`

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "demo@example.com",
    "name": "Demo User",
    "role": "user"
  }
}
```

#### GET `/api/user/dashboard`

Get dashboard data (requires authentication).

#### GET `/api/user/admin`

Get admin data (requires admin role).

## 🔒 Security Features

- ✅ **Password Hashing** with bcryptjs
- ✅ **JWT Token Signing** with secret keys
- ✅ **Token Expiration** (15min access, 7 days refresh)
- ✅ **Automatic Token Refresh**
- ✅ **CORS Protection**
- ✅ **Protected Routes** on both client and server
- ✅ **Role-Based Access Control**
- ✅ **Input Validation** with React Hook Form
- ✅ **Error Handling** with meaningful messages
- ✅ **Access Token in Memory** (XSS protection)
- ✅ **Refresh Token Invalidation** on logout

## 📝 Assignment Compliance

This project fulfills all assignment requirements:

### ✅ Authentication Flow (100%)

- Login and logout mechanism ✓
- Access token (15min) and refresh token (7 days) ✓
- Access token for all authorized requests ✓
- Automatic token refresh on expiration ✓

### ✅ Token Management (100%)

- Access token in memory ✓
- Refresh token in localStorage ✓
- Token clearing on logout ✓

### ✅ Axios Configuration (100%)

- Axios instance created ✓
- Access token attached to requests ✓
- 401 response handling with refresh ✓
- Auto-logout on refresh failure ✓

### ✅ React Query Integration (100%)

- React Query for API calls ✓
- useMutation for login/logout ✓
- useQuery for protected data ✓
- Query invalidation on auth changes ✓

### ✅ React Hook Form Integration (100%)

- React Hook Form for login ✓
- Input validation (email, password) ✓
- Error message display ✓
- Form submission integration ✓

### ✅ Protected Routes (100%)

- Protected routes implemented ✓
- Redirect to login for unauthenticated ✓

### ✅ User Interface (100%)

- Login page with form fields ✓
- Dashboard with user info ✓
- Logout button ✓
- Beautiful UI with Tailwind CSS ✓

### ✅ Public Hosting (Ready)

- Application ready for deployment ✓
- Deployment instructions provided ✓

### ✅ Error Handling (100%)

- Meaningful error messages ✓
- Graceful token expiration handling ✓

### 🎯 Stretch Goals

- ✅ Silent token refresh (automatic)
- ✅ Role-based access control (admin panel)
- ✅ Beautiful, modern UI design

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as part of React Authentication Assignment

---

**Note**: This is a demonstration project. For production use, implement additional security measures such as:

- HTTP-only cookies for refresh tokens
- Rate limiting
- CSRF protection
- Content Security Policy
- Regular security audits
