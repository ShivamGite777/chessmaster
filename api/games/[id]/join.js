import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory storage (in production, use a database)
let games = [
  {
    id: 'demo-game-1',
    whitePlayer: { 
      id: 'demo-user-123', 
      username: 'Demo User', 
      elo: 1200 
    },
    blackPlayer: null,
    status: 'waiting',
    timeControl: { type: 'blitz', initialTime: 300, increment: 5 },
    moves: [],
    currentPlayer: 'white',
    createdAt: new Date().toISOString()
  }
];

// Auth middleware
const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const user = authenticateToken(req);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required' 
        });
      }

      const { id } = req.query;
      const game = games.find(g => g.id === id);

      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      if (game.status !== 'waiting') {
        return res.status(400).json({
          success: false,
          error: 'Game is not available for joining'
        });
      }

      if (game.whitePlayer.id === user.userId) {
        return res.status(400).json({
          success: false,
          error: 'You cannot join your own game'
        });
      }

      // Join the game as black player
      game.blackPlayer = {
        id: user.userId,
        username: 'Player',
        elo: 1200
      };
      game.status = 'active';
      game.startedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        data: game
      });
    } catch (error) {
      console.error('Join game error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to join game' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}