# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No**
   - Project name: `chessmaster` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings? **No**

5. **Set Environment Variables**:
   ```bash
   vercel env add JWT_SECRET
   # Enter a secure secret key when prompted
   ```

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Framework Preset: **Other**
   - Root Directory: `.` (or leave default)
   - Build Command: `cd chess-frontend && npm install && npm run build`
   - Output Directory: `chess-frontend/public`

5. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `JWT_SECRET` with a secure value

6. **Deploy!**

## What's Included

✅ **Complete Backend API**:
- Authentication (register/login)
- Game management
- JWT token handling
- CORS configuration

✅ **Frontend Ready**:
- React + TypeScript
- Tailwind CSS styling
- Responsive design
- API integration

✅ **Vercel Optimized**:
- Serverless functions
- Automatic deployments
- Global CDN
- HTTPS enabled

## Testing Your Deployment

Once deployed, test these endpoints:

- `GET /api/health` - Should return API status
- `POST /api/auth/register` - Test user registration
- `POST /api/auth/login` - Test user login
- `GET /api/games` - Test game listing (requires auth)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |

## Troubleshooting

### Build Fails
- Check that Node.js version is 18+
- Ensure all dependencies are installed
- Check build logs in Vercel dashboard

### API Not Working
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure CORS is properly configured

### Frontend Not Loading
- Check that the build output directory is correct
- Verify static files are being served
- Check browser console for errors

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the function logs in the dashboard
3. Test API endpoints individually
4. Check browser network tab for errors

Your chess game should now be live and fully functional on Vercel! 🚀♟️