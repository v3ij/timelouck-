async function runTests() {
    try {
        console.log("1. Testing Booking API (Cash at bank)...");
        const bookingRes = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'e0000000-0000-0000-0000-000000000002',
                tenant_id: 'c0000000-0000-0000-0000-000000000002',
                contract_type: 'hotel_stay',
                start_date: '2026-03-03',
                amount: 200,
                payment_method: 'Cash at bank'
            })
        });
        const bookingData = await bookingRes.json();
        console.log('Booking Result:', bookingData);

        console.log("\n2. Testing Profile Update API...");
        const profileRes = await fetch('http://localhost:3000/api/profiles/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': 'e0000000-0000-0000-0000-000000000001'
            },
            body: JSON.stringify({
                national_id: "ST12345678",
                metadata: {
                    parent_id: "NIN87654321",
                    profession: "Software Engineer",
                    health_condition: "None",
                    bank_transfer_info: "Centenary Bank - Acc: 123456"
                }
            })
        });
        const profileData = await profileRes.json();
        console.log('Profile Sync Result:', profileData);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

runTests();
