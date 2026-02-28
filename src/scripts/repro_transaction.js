const API_URL = 'http://localhost:3000/api';

const run = async () => {
    try {
        console.log('1. Registering test user...');
        const email = `test_${Date.now()}@example.com`;
        const password = 'password123';

        await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test User',
                email,
                password,
                phone: '1234567890'
            })
        }).catch(() => { }); // Ignore if exists

        console.log('2. Logging in...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('   Token obtained.');

        console.log('3. Attempting TopUp...');
        const topupRes = await fetch(`${API_URL}/wallet/topup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: 5000, method: 'card' })
        });

        const text = await topupRes.text();
        try {
            const data = JSON.parse(text);
            if (!topupRes.ok) {
                console.error('❌ TopUp Failed!');
                console.error('Status:', topupRes.status);
                console.error('Message:', data.message);
                console.error('Full Body:', JSON.stringify(data, null, 2));
            } else {
                console.log('✅ TopUp Success:', data);
            }
        } catch (e) {
            console.error('❌ TopUp Failed (Non-JSON response)!');
            console.error('Body:', text);
        }

    } catch (err) {
        console.error('❌ Script Error:', err.message);
    }
};

run();
