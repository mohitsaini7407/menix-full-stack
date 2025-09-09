# 🚀 Vercel Deployment Checklist

## Pre-Deployment Setup

### ✅ Project Structure
- [x] Frontend and backend separated
- [x] Proper package.json files for both
- [x] Vercel configuration files created
- [x] Environment variables configured
- [x] Build process working

### ✅ Dependencies
- [x] Frontend dependencies installed
- [x] Backend dependencies installed
- [x] Build scripts configured
- [x] Vercel CLI installed

## Deployment Steps

### 1. Backend Deployment (menix-backend.vercel.app)

#### Environment Variables to Set in Vercel Dashboard:
```bash
MONGO_URI=mongodb+srv://mohitsaini7407:mohit7407@menix.804cf5m.mongodb.net/
FRONTEND_URL=https://menix.vercel.app
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret_here
LOG_LEVEL=info
```

#### Deploy Command:
```bash
cd backend
vercel --prod
```

### 2. Frontend Deployment (menix.vercel.app)

#### Environment Variables to Set in Vercel Dashboard:
```bash
VITE_API_URL=https://menix-backend.vercel.app
VITE_APP_NAME=Menix Tournament App
VITE_APP_VERSION=1.0.0
```

#### Deploy Command:
```bash
vercel --prod
```

### 3. Quick Deploy Both
```bash
npm run deploy-all
```

## Post-Deployment Verification

### Backend Health Check
- [ ] Visit: https://menix-backend.vercel.app/api/health
- [ ] Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

### Frontend API Connection
- [ ] Visit: https://menix.vercel.app
- [ ] Check browser console for API connection errors
- [ ] Test the API Test component if added to your app

### MongoDB Connection
- [ ] Backend logs should show "MongoDB Connected: ..."
- [ ] Test user creation via API
- [ ] Verify data persistence

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check FRONTEND_URL in backend environment variables
   - Ensure it matches exactly: `https://menix.vercel.app`

2. **MongoDB Connection Failed**
   - Verify MONGO_URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure IP whitelist includes Vercel's IPs

3. **Environment Variables Not Working**
   - Redeploy after setting environment variables
   - Check variable names match exactly (case-sensitive)
   - Verify in Vercel dashboard

4. **Build Failures**
   - Check for syntax errors in code
   - Verify all dependencies are installed
   - Check Vercel build logs

## Final Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] MongoDB connection working
- [ ] CORS configured properly
- [ ] API endpoints responding
- [ ] Frontend can communicate with backend
- [ ] User registration/login working
- [ ] Data persistence verified

## URLs Summary

- **Frontend**: https://menix.vercel.app
- **Backend**: https://menix-backend.vercel.app
- **MongoDB**: mongodb+srv://mohitsaini7407:mohit7407@menix.804cf5m.mongodb.net/

## Support Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

🎯 **Ready for deployment!** Follow this checklist step by step. 