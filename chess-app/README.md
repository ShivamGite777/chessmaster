# Chess Master - Real-time Multiplayer Chess App

A modern, responsive web application for real-time multiplayer chess built with React, TypeScript, and WebSocket integration.

## Features

### Core Game Features
- **Real-time Multiplayer Chess**: Play chess with players worldwide in real-time
- **Interactive Chess Board**: Drag-and-drop piece movement with legal move highlighting
- **Multiple Time Controls**: Blitz (3+0, 5+0), Rapid (10+0, 15+10), Classical (30+0, 60+0)
- **Game Modes**: Public and private games
- **Move History**: Complete game replay and move tracking
- **Captured Pieces**: Visual display of captured pieces
- **Promotion Dialog**: Choose promotion piece (Queen, Rook, Bishop, Knight)

### User Features
- **Authentication**: Secure login/register with JWT tokens
- **User Profiles**: ELO rating, game statistics, and match history
- **Leaderboard**: Global rankings and player statistics
- **Game History**: Complete match history with filters
- **Responsive Design**: Mobile-first design that works on all devices

### Technical Features
- **Real-time Updates**: WebSocket integration for instant game updates
- **State Management**: Redux Toolkit for predictable state management
- **Form Validation**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth user interactions
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with shadcn/ui components

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Chess Logic**: chess.js
- **Real-time**: Socket.io-client
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running on `http://localhost:3000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chess-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your backend API URLs:
```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chess/          # Chess-specific components
│   ├── game/           # Game-related components
│   ├── auth/           # Authentication components
│   ├── ui/             # Base UI components
│   └── layout/         # Layout components
├── pages/              # Page components
├── store/              # Redux store and slices
├── services/           # API and WebSocket services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main app component
```

## API Integration

The app expects the following backend API endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Games
- `GET /api/games/available` - Get available games
- `POST /api/games` - Create new game
- `GET /api/games/:id` - Get game details
- `POST /api/games/:id/join` - Join game
- `POST /api/games/:id/move` - Make move
- `POST /api/games/:id/resign` - Resign game
- `POST /api/games/:id/draw` - Offer draw

### User Data
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard
- `GET /api/users/history` - Get game history

## WebSocket Events

### Client to Server
- `join_game` - Join a game room
- `leave_game` - Leave a game room
- `make_move` - Send move to server
- `offer_draw` - Offer draw
- `accept_draw` - Accept draw offer
- `decline_draw` - Decline draw offer
- `resign` - Resign game

### Server to Client
- `game_joined` - Successfully joined game
- `opponent_joined` - Opponent joined game
- `move_made` - Opponent made a move
- `game_state_update` - Game state changed
- `time_update` - Timer update
- `check` - King is in check
- `checkmate` - Game ended by checkmate
- `stalemate` - Game ended by stalemate
- `draw_offered` - Draw offer received
- `game_ended` - Game ended

## Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/chess-master-app)

### Manual Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   - `VITE_API_URL`: Your backend API URL
   - `VITE_WS_URL`: Your WebSocket URL

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_WS_URL=https://your-api-domain.com
```

### Deployment Options

- **Vercel** (Recommended): Automatic deployments from GitHub
- **Netlify**: Drag and drop the `dist` folder or connect to Git
- **AWS S3 + CloudFront**: Upload to S3 and configure CloudFront
- **Docker**: Use the provided Dockerfile for containerized deployment

### Vercel Configuration

The project includes a `vercel.json` configuration file with:
- Optimized build settings
- SPA routing support
- Static asset caching
- Environment variable management

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@chessmaster.com or create an issue in the repository.