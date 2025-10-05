# Vercel Deployment Guide

This guide will help you deploy the Chess Master application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API URL
3. Your WebSocket URL

## Deployment Steps

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to your project directory:**
   ```bash
   cd chess-app
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel
   ```

5. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - Project name: `chess-master-app` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? `N`

### Method 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "feat: prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**

3. **Click "New Project"**

4. **Import your GitHub repository**

5. **Configure the project:**
   - Framework Preset: `Vite`
   - Root Directory: `./` (or leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Set Environment Variables:**
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-api.vercel.app/api`)
   - `VITE_WS_URL`: Your WebSocket URL (e.g., `https://your-api.vercel.app`)

7. **Click "Deploy"**

## Environment Variables

Set these environment variables in your Vercel project:

### Required Variables

- `VITE_API_URL`: Your backend API base URL
  - Example: `https://your-backend-api.vercel.app/api`
  - Example: `https://api.chessmaster.com/api`

- `VITE_WS_URL`: Your WebSocket server URL
  - Example: `https://your-backend-api.vercel.app`
  - Example: `wss://ws.chessmaster.com`

### Setting Environment Variables

1. Go to your project dashboard on Vercel
2. Click on "Settings"
3. Click on "Environment Variables"
4. Add each variable:
   - Name: `VITE_API_URL`
   - Value: Your API URL
   - Environment: Production, Preview, Development
5. Repeat for `VITE_WS_URL`

## Custom Domain (Optional)

1. Go to your project dashboard
2. Click on "Settings"
3. Click on "Domains"
4. Add your custom domain
5. Follow the DNS configuration instructions

## Build Configuration

The project is configured with:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **Node.js Version**: 18.x (default)

## Troubleshooting

### Build Failures

If the build fails, check:

1. **TypeScript errors**: Run `npm run type-check` locally
2. **Missing dependencies**: Ensure all packages are in `package.json`
3. **Environment variables**: Make sure they're set correctly

### Runtime Issues

1. **API connection errors**: Verify `VITE_API_URL` is correct
2. **WebSocket connection errors**: Verify `VITE_WS_URL` is correct
3. **CORS issues**: Ensure your backend allows requests from your Vercel domain

### Performance Optimization

The app includes:

- Code splitting with lazy loading
- Optimized bundle size
- Caching headers for static assets
- Tree shaking for unused code

## Monitoring

Vercel provides:

- Real-time deployment logs
- Performance metrics
- Error tracking
- Analytics (with Vercel Analytics)

## Updates

To update your deployment:

1. Push changes to your main branch
2. Vercel will automatically redeploy
3. Or manually trigger a deployment from the dashboard

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Example Backend Integration

Your backend should provide these endpoints:

```
GET  /api/auth/me
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

GET  /api/games/available
POST /api/games
GET  /api/games/:id
POST /api/games/:id/join
POST /api/games/:id/move
POST /api/games/:id/resign
POST /api/games/:id/draw

GET  /api/users/stats
GET  /api/users/leaderboard
GET  /api/users/history
```

WebSocket events:
- `join_game`
- `leave_game`
- `make_move`
- `game_state_update`
- `opponent_joined`
- `opponent_left`
- `check`
- `checkmate`
- `draw_offered`
- `game_ended`