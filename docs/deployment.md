# Deployment Guide

## Frontend (Vercel)
1. Set environment variables from frontend/.env.example.
2. Build command: npm run build
3. Output: .next

## Backend (Render/Railway)
1. Set environment variables from backend/.env.example.
2. Build command: npm run build
3. Start command: npm run start

## MongoDB Atlas
- Create cluster, whitelist IPs, and use the connection string in MONGO_URI.
