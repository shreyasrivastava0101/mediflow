async function runTests() {
  const baseURL = 'http://localhost:5000/api';
  console.log('--- RUNNING AUTH TESTS ---');
  
  try {
    // 0. Test Seed (to ensure users exist)
    console.log('Testing Seed API...');
    let res = await fetch(`${baseURL}/seed`, { method: 'POST' });
    let data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log('✅ Seed successful\n');

    // 1. Test Login (Demo Admin)
    console.log('Testing Demo Login (admin@mediflow.com)...');
    res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mediflow.com', password: 'password123' })
    });
    data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log('✅ Login successful, role:', data.user.role, '\n');

    // 2. Test Register
    console.log('Testing Registration...');
    const testEmail = `test${Date.now()}@mediflow.com`;
    res = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: testEmail, password: 'password123', role: 'Doctor' })
    });
    data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log('✅ Registration successful\n');

    // 3. Test Login with New User
    console.log('Testing Login with New User...');
    res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'password123' })
    });
    data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    const token = data.token;
    console.log('✅ New User Login successful, role:', data.user.role, '\n');

    // 4. Test Get Me (Logout simulation since JWT is stateless)
    console.log('Testing Protected Route (Me)...');
    res = await fetch(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    console.log('✅ Protected Route successful, user:', data.data.email, '\n');

    console.log('ALL TESTS PASSED 🎉');
  } catch (error) {
    console.error('❌ TEST FAILED');
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

runTests();
