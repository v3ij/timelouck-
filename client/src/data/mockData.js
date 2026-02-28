export const mockData = {
    students: [
        { id: 'ST-2024-001', name: 'Ahmed Hassan', grade: '10A', status: 'Present', parentPhone: '+256 772 123456', wallet: 5000, lastAccess: '08:00 AM' },
        { id: 'ST-2024-002', name: 'Sara Amina', grade: '10A', status: 'Absent', parentPhone: '+256 772 987654', wallet: 2500, lastAccess: '-' },
        { id: 'ST-2024-003', name: 'Grace Nalwanga', grade: '11B', status: 'Present', parentPhone: '+256 701 555666', wallet: 10000, lastAccess: '07:45 AM' },
        { id: 'ST-2024-004', name: 'David Ochieng', grade: '12C', status: 'Late', parentPhone: '+256 753 111222', wallet: 0, lastAccess: '09:15 AM' },
        { id: 'ST-2024-005', name: 'John Doe', grade: '9A', status: 'Present', parentPhone: '+256 772 333444', wallet: 7500, lastAccess: '07:55 AM' },
        { id: 'ST-2024-006', name: 'Jane Smith', grade: '9A', status: 'Present', parentPhone: '+256 772 555666', wallet: 4000, lastAccess: '08:05 AM' },
        { id: 'ST-2024-007', name: 'Michael Brown', grade: '10B', status: 'Absent', parentPhone: '+256 772 777888', wallet: 1500, lastAccess: '-' },
        { id: 'ST-2024-008', name: 'Emily Davis', grade: '11A', status: 'Present', parentPhone: '+256 772 999000', wallet: 6000, lastAccess: '07:50 AM' },
        { id: 'ST-2024-009', name: 'Daniel Wilson', grade: '12B', status: 'Present', parentPhone: '+256 772 111222', wallet: 3000, lastAccess: '08:10 AM' },
        { id: 'ST-2024-010', name: 'Sophia Taylor', grade: '9C', status: 'Late', parentPhone: '+256 772 333444', wallet: 500, lastAccess: '08:45 AM' },
    ],
    rooms: [
        { id: '101', type: 'Deluxe', status: 'Occupied', guest: 'John Doe', checkOut: '2024-10-28', battery: 85, lockStatus: 'Online' },
        { id: '102', type: 'Deluxe', status: 'Occupied', guest: 'Jane Smith', checkOut: '2024-10-29', battery: 92, lockStatus: 'Online' },
        { id: '103', type: 'Standard', status: 'Vacant', guest: '-', checkOut: '-', battery: 78, lockStatus: 'Online' },
        { id: '104', type: 'Standard', status: 'Cleaning', guest: '-', checkOut: '-', battery: 45, lockStatus: 'Offline' }, // Alert case
        { id: '105', type: 'Suite', status: 'Occupied', guest: 'VIP Guest', checkOut: '2024-11-01', battery: 100, lockStatus: 'Online' },
        { id: '106', type: 'Standard', status: 'Vacant', guest: '-', checkOut: '-', battery: 88, lockStatus: 'Online' },
        { id: '107', type: 'Standard', status: 'Occupied', guest: 'Alex Jones', checkOut: '2024-10-27', battery: 60, lockStatus: 'Online' },
        { id: '108', type: 'Deluxe', status: 'Vacant', guest: '-', checkOut: '-', battery: 95, lockStatus: 'Online' },
        { id: '109', type: 'Suite', status: 'Cleaning', guest: '-', checkOut: '-', battery: 82, lockStatus: 'Online' },
        { id: '110', type: 'Standard', status: 'Occupied', guest: 'Sarah Connor', checkOut: '2024-10-30', battery: 90, lockStatus: 'Online' },
    ],
    transactions: [
        { id: 'TXN-001', type: 'Rent Payment', amount: 150000, date: '2024-10-26 14:30', user: 'John Doe' },
        { id: 'TXN-002', type: 'Wallet Top-up', amount: 5000, date: '2024-10-26 08:15', user: 'Ahmed Hassan' },
        { id: 'TXN-003', type: 'SMS Fee', amount: 50, date: '2024-10-26 09:00', user: 'System (Bulk Alert)' },
        { id: 'TXN-004', type: 'Rent Payment', amount: 200000, date: '2024-10-25 18:45', user: 'VIP Guest' },
        { id: 'TXN-005', type: 'Wallet Top-up', amount: 10000, date: '2024-10-25 07:50', user: 'Grace Nalwanga' },
    ],
    smsLogs: [
        { id: 1, recipient: '+256 772 987654', message: 'Alert: Sara Amina was marked ABSENT today.', status: 'Delivered', time: '09:30 AM' },
        { id: 2, recipient: '+256 753 111222', message: 'Notice: David Ochieng arrived late (09:15 AM).', status: 'Delivered', time: '09:20 AM' },
        { id: 3, recipient: '+256 772 123456', message: 'Payment Received: 5000 UGX added to Ahmed Wallet.', status: 'Delivered', time: '08:16 AM' },
    ]
};
