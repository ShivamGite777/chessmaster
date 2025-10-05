# Chess Master - Multiplayer Chess Game

A modern, real-time multiplayer chess game built with React, TypeScript, and Vercel.

## Features

- 🎮 Real-time multiplayer chess
- 🔐 User authentication and registration
- 🏆 ELO rating system
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly design
- 🚀 Deployed on Vercel

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Vercel API Routes, Node.js
- **Authentication**: JWT tokens
- **Chess Logic**: Chess.js
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/games` - Get available games
- `POST /api/games` - Create new game

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the configuration and deploy

### Environment Variables

Set these in your Vercel dashboard:

- `JWT_SECRET` - Secret key for JWT tokens

## Project Structure

```
├── api/                    # Vercel API routes
│   ├── auth/              # Authentication endpoints
│   └── games/             # Game management endpoints
├── chess-frontend/        # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # State management
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── vercel.json           # Vercel configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details