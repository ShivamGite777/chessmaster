exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Parse the path
  const path = event.path.replace('/.netlify/functions/api', '');
  
  // Health check
  if (path === '/health' && event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Chess API is running!',
        timestamp: new Date().toISOString()
      })
    };
  }

  // Auth endpoints
  if (path === '/auth/register' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { username, email, password } = body;

      if (!username || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'All fields are required'
          })
        };
      }

      // Simple user creation (in production, use a database)
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        email,
        elo: 1200,
        wins: 0,
        losses: 0,
        draws: 0,
        createdAt: new Date().toISOString()
      };

      // Simple token (in production, use JWT)
      const token = 'demo-token-' + user.id;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            user,
            token
          }
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Registration failed'
        })
      };
    }
  }

  if (path === '/auth/login' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { email, password } = body;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Email and password are required'
          })
        };
      }

      // Simple demo user
      const user = {
        id: 'demo-user-123',
        username: 'Demo User',
        email,
        elo: 1200,
        wins: 5,
        losses: 2,
        draws: 1,
        createdAt: new Date().toISOString()
      };

      const token = 'demo-token-' + user.id;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            user,
            token
          }
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Login failed'
        })
      };
    }
  }

  // Games endpoints
  if (path === '/games' && event.httpMethod === 'GET') {
    // Return demo games
    const demoGames = [
      {
        id: 'demo-game-1',
        whitePlayer: { id: 'demo-user-123', username: 'Demo User', elo: 1200 },
        blackPlayer: null,
        status: 'waiting',
        timeControl: { type: 'blitz', initialTime: 300, increment: 5 },
        moves: [],
        currentPlayer: 'white',
        createdAt: new Date().toISOString()
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: demoGames
      })
    };
  }

  if (path === '/games' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { timeControl } = body;

      const game = {
        id: 'demo-game-' + Math.random().toString(36).substr(2, 9),
        whitePlayer: { id: 'demo-user-123', username: 'Demo User', elo: 1200 },
        blackPlayer: null,
        status: 'waiting',
        timeControl: timeControl || { type: 'blitz', initialTime: 300, increment: 5 },
        moves: [],
        currentPlayer: 'white',
        createdAt: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: game
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to create game'
        })
      };
    }
  }

  // Default response
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      success: false,
      error: 'Endpoint not found',
      path: path,
      method: event.httpMethod
    })
  };
};