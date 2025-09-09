# Menix Tournament App

A BGMI tournament application with separate frontend and backend deployments on Vercel.

## Project Structure

```
├── android/               # build android application for webView
├── src/                   # Frontend React source code
├── backend/               # Backend Express.js server
├── public/                # Static assets
├── dist/                  # Build output
├── vercel.json           # Frontend Vercel configuration
├── backend/vercel.json   # Backend Vercel configuration
└── package.json          # Frontend dependencies
```

## Deployment URLs

- **Frontend**
- **Backend**

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=https
VITE_APP_NAME
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

### Backend (env.example)
```bash
MONGO_URI
FRONTEND_URL
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
LOG_LEVEL=info
```

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Environment Setup

**Frontend:**
- Copy `env.example` to `.env`
- Update the values as needed

**Backend:**
- Copy `backend/env.example` to `backend/.env`
- Update the MongoDB URI and other values

### 3. Local Development

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

### 4. Build

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd backend
npm run build
```

## Deployment

### Deploy Both (Recommended)
```bash
npm run deploy-all
```

### Deploy Separately

**Frontend:**
```bash
npm run deploy-frontend
```

**Backend:**
```bash
npm run deploy-backend
```

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - API status
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## MongoDB Connection

The backend connects to MongoDB Atlas using the provided connection string:
```
mongodb+srv://name:<id>.<link>/
```

## CORS Configuration

The backend is configured to accept requests from the frontend domain:
- Frontend URL: <web Host Link>
- CORS is enabled with credentials support

## Security Features

- Helmet.js for security headers
- CORS protection
- Request size limits
- Compression enabled
- Morgan logging

## Development vs Production

- **Development**: Uses local environment variables
- **Production**: Uses Vercel environment variables
- **Build**: Frontend builds to `dist/` folder
- **Backend**: No build step required (Node.js runtime)

## Troubleshooting

1. **MongoDB Connection Issues**: Check the MONGO_URI in backend environment variables
2. **CORS Errors**: Verify FRONTEND_URL in backend environment variables
3. **Build Failures**: Ensure all dependencies are installed
4. **Deployment Issues**: Check Vercel logs and environment variables

## Support

For deployment issues, check:
- Vercel dashboard logs
- Environment variable configuration
- MongoDB Atlas connection status
- Network connectivity between services # menix-full-stack
