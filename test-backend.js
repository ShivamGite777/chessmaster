// Simple test script to verify backend is working
const testBackend = async () => {
  const baseUrl = 'https://youchessme.netlify.app/.netlify/functions/api';
  
  console.log('Testing backend API...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test registration
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData.success ? 'Success' : 'Failed');
    
    if (registerData.success) {
      // Test login
      const loginResponse = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword123'
        })
      });
      const loginData = await loginResponse.json();
      console.log('✅ Login:', loginData.success ? 'Success' : 'Failed');
      
      if (loginData.success) {
        const token = loginData.data.token;
        
        // Test creating a game
        const gameResponse = await fetch(`${baseUrl}/games`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            timeControl: {
              type: 'blitz',
              initialTime: 300,
              increment: 5
            }
          })
        });
        const gameData = await gameResponse.json();
        console.log('✅ Create game:', gameData.success ? 'Success' : 'Failed');
        
        if (gameData.success) {
          console.log('🎉 Backend is working perfectly!');
          console.log('Game ID:', gameData.data.id);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
};

// Run the test
testBackend();