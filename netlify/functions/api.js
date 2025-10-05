const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Chess } = require('chess.js');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory storage (in production, use a database)
let users = [];
let games = [];
let gameStates = new Map();

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const hashPassword = (password) => bcrypt.hashSync(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
const generateToken = (user) => jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Chess API is running!' });
});

// Auth routes
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create user
    const user = {
      id: generateId(),
      username,
      email,
      password: hashPassword(password),
      elo: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Game routes
app.get('/games', authenticateToken, (req, res) => {
  try {
    const availableGames = games.filter(game => 
      game.status === 'waiting' || 
      (game.status === 'active' && (game.whitePlayer.id === req.user.userId || game.blackPlayer.id === req.user.userId))
    );

    res.json({
      success: true,
      data: availableGames
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch games' });
  }
});

app.post('/games', authenticateToken, (req, res) => {
  try {
    const { timeControl } = req.body;
    const user = users.find(u => u.id === req.user.userId);

    const game = {
      id: generateId(),
      whitePlayer: user,
      blackPlayer: null,
      status: 'waiting',
      timeControl,
      moves: [],
      currentPlayer: 'white',
      createdAt: new Date().toISOString()
    };

    games.push(game);

    // Initialize game state
    const chess = new Chess();
    gameStates.set(game.id, {
      fen: chess.fen(),
      moves: [],
      currentPlayer: 'white',
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      isDraw: false,
      capturedPieces: { white: [], black: [] },
      timeLeft: { white: timeControl.initialTime, black: timeControl.initialTime }
    });

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create game' });
  }
});

app.post('/games/:id/join', authenticateToken, (req, res) => {
  try {
    const gameId = req.params.id;
    const game = games.find(g => g.id === gameId);

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    if (game.status !== 'waiting') {
      return res.status(400).json({ success: false, error: 'Game is not available' });
    }

    const user = users.find(u => u.id === req.user.userId);
    game.blackPlayer = user;
    game.status = 'active';
    game.startedAt = new Date().toISOString();

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to join game' });
  }
});

app.get('/games/:id', authenticateToken, (req, res) => {
  try {
    const gameId = req.params.id;
    const game = games.find(g => g.id === gameId);

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    // Check if user is part of this game
    if (game.whitePlayer.id !== req.user.userId && game.blackPlayer?.id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch game' });
  }
});

app.post('/games/:id/move', authenticateToken, (req, res) => {
  try {
    const gameId = req.params.id;
    const { from, to, promotion } = req.body;
    const game = games.find(g => g.id === gameId);

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    // Check if user is part of this game
    if (game.whitePlayer.id !== req.user.userId && game.blackPlayer?.id !== req.user.userId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    // Get game state
    const gameState = gameStates.get(gameId);
    if (!gameState) {
      return res.status(400).json({ success: false, error: 'Game state not found' });
    }

    // Create chess instance
    const chess = new Chess(gameState.fen);

    // Try to make the move
    const move = chess.move({ from, to, promotion });
    if (!move) {
      return res.status(400).json({ success: false, error: 'Invalid move' });
    }

    // Update game state
    gameState.fen = chess.fen();
    gameState.moves.push({
      from: move.from,
      to: move.to,
      piece: move.piece,
      captured: move.captured,
      promotion: move.promotion,
      san: move.san,
      timestamp: Date.now(),
      timeLeft: { white: gameState.timeLeft.white, black: gameState.timeLeft.black }
    });
    gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    gameState.isCheck = chess.isCheck();
    gameState.isCheckmate = chess.isCheckmate();
    gameState.isStalemate = chess.isStalemate();
    gameState.isDraw = chess.isDraw();

    // Update game
    game.moves = gameState.moves;
    game.currentPlayer = gameState.currentPlayer;

    // Check for game end
    if (gameState.isCheckmate || gameState.isStalemate || gameState.isDraw) {
      game.status = 'finished';
      game.finishedAt = new Date().toISOString();
      if (gameState.isCheckmate) {
        game.winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
      }
    }

    res.json({
      success: true,
      data: {
        game,
        gameState
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to make move' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Export for Netlify Functions
module.exports.handler = serverless(app);