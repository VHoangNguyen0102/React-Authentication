import jwt from 'jsonwebtoken';

// Mock user database (in production, use a real database)
const users = [
  {
    id: 1,
    email: 'demo@example.com',
    password: '$2a$10$F6T5rOs7DSgwgaDDT9dYauirPx19nXwBYNXaXPnqERuB5HLYKRaJ2', // password: demo123
    name: 'Demo User',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@example.com',
    password: '$2a$10$F6T5rOs7DSgwgaDDT9dYauirPx19nXwBYNXaXPnqERuB5HLYKRaJ2', // password: demo123
    name: 'Admin User',
    role: 'admin'
  }
];

// Store refresh tokens (in production, use Redis or database)
let refreshTokens = [];

export const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name,
      role: user.role 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const addRefreshToken = (token) => {
  refreshTokens.push(token);
};

export const removeRefreshToken = (token) => {
  refreshTokens = refreshTokens.filter(t => t !== token);
};

export const isRefreshTokenValid = (token) => {
  return refreshTokens.includes(token);
};
