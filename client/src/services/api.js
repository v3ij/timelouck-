const API_BASE_URL = '/api';

export const fetchWalletBalance = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/wallet/balance/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        return null;
    }
};

export const fetchUserLogs = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/logs/me`, {
            headers: {
                'x-user-id': userId
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user logs');
        return await response.json();
    } catch (error) {
        console.error('Fetch logs error:', error);
        return null; // Fallback or empty state handler
    }
};

export const getUserProfile = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unauthorized Access Domain');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const triggerUnlock = async (macAddress, rfidTag) => {
    try {
        const response = await fetch(`${API_BASE_URL}/hardware/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mac_address: macAddress, rfid_tag: rfidTag }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error triggering unlock:', error);
        return { status: 'error', message: 'Failed to connect to lock service.' };
    }
};

export const simulateTopUp = async (phoneNumber, amountUgx, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transaction_id: `MOCK_TX_${Date.now()}`,
                phone_number: phoneNumber,
                amount_ugx: amountUgx,
                provider: 'MTN',
                reference_code: userId // In our setup, reference_code is the wallet ID
            }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error simulating topup:', error);
        return { status: 'error', message: 'Payment gateway error.' };
    }
};

export const fetchSuperAdminStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/super`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching SuperAdmin stats:', error);
        return null;
    }
};

export const fetchTenantStats = async (tenantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/tenant/${tenantId}`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching Tenant stats:', error);
        return null;
    }
};

export const fetchAdminStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return null;
    }
};

export const fetchAdminUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return null;
    }
};

export const fetchAdminTenants = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/tenants`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching admin tenants:', error);
        return null;
    }
};

export const triggerGlobalTopup = async (amount) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/demo/topup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error triggering global topup:', error);
        return { status: 'error', message: 'Failed to trigger topup.' };
    }
};

export const startActiveSession = async (userId, deviceId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, deviceId }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error starting active session:', error);
        return { status: 'error', message: 'Connection error starting session.' };
    }
};

export const fetchActiveSession = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/active/${userId}`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching active session:', error);
        return null;
    }
};

export const stopActiveSession = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sessions/stop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error stopping active session:', error);
        return { status: 'error', message: 'Connection error stopping session.' };
    }
};

export const fetchTaxRecords = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/tax-records`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching tax records:', error);
        return null;
    }
};

export const triggerRemoteOverride = async (deviceId, reason) => {
    try {
        const response = await fetch(`${API_BASE_URL}/hardware/override`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, reason }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error triggering remote override:', error);
        return { status: 'error', message: 'Failed to dispatch remote override.' };
    }
};

export const fetchDevices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/devices`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching devices:', error);
        return null;
    }
};

export const fetchTenantUsers = async (tenantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/tenant/${tenantId}/users`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching tenant users:', error);
        return null;
    }
};

export const fetchTenantNotifications = async (tenantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/logs/notifications/${tenantId}`);
        if (!response.ok) throw new Error('Network error');
        return await response.json();
    } catch (error) {
        console.error('Error fetching tenant notifications:', error);
        return null;
    }
};

export const createDevice = async (name, macAddress, tenantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/devices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mac_address: macAddress, tenant_id: tenantId ? parseInt(tenantId) : null }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating device:', error);
        return { status: 'error', message: 'Failed to create device.' };
    }
};
