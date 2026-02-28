export const mock = {
    users: [
        { id: 'USR-001', name: 'Ahmed Hassan', email: 'ahmed@school.com', role: 'Student', wallet: 5000, accessLevel: 'Basic' },
        { id: 'USR-002', name: 'Sarah Ouma', email: 'sarah@school.com', role: 'Student', wallet: 1200, accessLevel: 'Basic' },
        { id: 'ADM-001', name: 'Admin User', email: 'admin@cortex.com', role: 'SuperAdmin', wallet: 0, accessLevel: 'Full' },
        { id: 'GST-001', name: 'John Doe', email: 'john.doe@gmail.com', role: 'Guest', wallet: 0, accessLevel: 'Temp' }
    ],
    rooms: [
        { id: 101, status: 'Occupied', battery: 85, guest: 'John Doe', type: 'Standard' },
        { id: 102, status: 'Available', battery: 92, guest: null, type: 'Deluxe' },
        { id: 103, status: 'Maintenance', battery: 15, guest: null, type: 'Suite' },
        { id: 104, status: 'Occupied', battery: 78, guest: 'Jane Smith', type: 'Standard' }
    ],
    logs: [
        { id: 1, time: '08:00 AM', user: 'Ahmed Hassan', action: 'Unlock Data Lab', status: 'Success' },
        { id: 2, time: '08:15 AM', user: 'Sarah Ouma', action: 'Unlock Library', status: 'Success' },
        { id: 3, time: '08:20 AM', user: 'Unknown', action: 'Unlock Main Gate', status: 'Failed' }
    ],
    stats: {
        revenue: 'UGX 45.2M',
        activeTenants: 12,
        totalUsers: 1450,
        systemHealth: '98%'
    }
};
