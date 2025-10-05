// Simple API simulation for chess game
// This provides mock data for the frontend

const API_BASE = '/api';

// Mock data storage
let users = [
  {
    id: 'demo-user-123',
    username: 'Demo User',
    email: 'demo@example.com',
    elo: 1200,
    wins: 5,
    losses: 2,
    draws: 1,
    createdAt: new Date().toISOString()
  }
];

let games = [
  {
    id: 'demo-game-1',
    whitePlayer: users[0],
    blackPlayer: null,
    status: 'waiting',
    timeControl: { type: 'blitz', initialTime: 300, increment: 5 },
    moves: [],
    currentPlayer: 'white',
    createdAt: new Date().toISOString()
  }
];

// API functions
window.ChessAPI = {
  // Health check
  async health() {
    return {
      success: true,
      message: 'Chess API is running!',
      timestamp: new Date().toISOString()
    };
  },

  // Authentication
  async register(userData) {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      elo: 1200,
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    
    return {
      success: true,
      data: {
        user,
        token: 'demo-token-' + user.id
      }
    };
  },

  async login(credentials) {
    const user = users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: {
        user,
        token: 'demo-token-' + user.id
      }
    };
  },

  // Games
  async getGames() {
    return {
      success: true,
      data: games
    };
  },

  async createGame(timeControl) {
    const game = {
      id: 'demo-game-' + Math.random().toString(36).substr(2, 9),
      whitePlayer: users[0],
      blackPlayer: null,
      status: 'waiting',
      timeControl: timeControl || { type: 'blitz', initialTime: 300, increment: 5 },
      moves: [],
      currentPlayer: 'white',
      createdAt: new Date().toISOString()
    };
    games.push(game);
    
    return {
      success: true,
      data: game
    };
  },

  async joinGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    game.blackPlayer = users[0];
    game.status = 'active';
    game.startedAt = new Date().toISOString();
    
    return {
      success: true,
      data: game
    };
  },

  async getGame(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    return {
      success: true,
      data: game
    };
  },

  async makeMove(gameId, move) {
    const game = games.find(g => g.id === gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    
    // Simple move validation (in a real app, use chess.js)
    const newMove = {
      from: move.from,
      to: move.to,
      piece: 'p', // Simplified
      timestamp: Date.now()
    };
    
    game.moves.push(newMove);
    game.currentPlayer = game.currentPlayer === 'white' ? 'black' : 'white';
    
    return {
      success: true,
      data: {
        game,
        move: newMove
      }
    };
  }
};

// Make API available globally
console.log('Chess API loaded and ready!');