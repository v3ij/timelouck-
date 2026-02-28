# TimeLock Access - API Structure & Integration Guide

This document lists the fully implemented API endpoints and service methods ready for integration.

## 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Payload |
|:--- |:--- |:--- |:--- |
| POST | `/api/auth/register` | User Registration | `{ name, email, password, phone }` |
| POST | `/api/auth/login` | User Login | `{ email, password }` |

## 2. Hardware Control (Strict Java SDK Protocol)
**Service:** `src/services/LockService.js`
The following commands generate specific Hex/Byte Arrays matching `MachineCommand.java`.

| Function | Command String (Internal) | Description |
|:--- |:--- |:--- |
| `openDoor(sn, doorNum)` | `{"cmd":"opendoor","doornum":1}` | Unlocks specific door on controller |
| `syncTime(sn)` | `{"cmd":"settime","cloudtime":"..."}` | Synchronizes device time |
| `getLogs(sn)` | `{"cmd":"getalllog","stn":true}` | Retrieves all access logs |

**Usage:**
```javascript
import { lockService } from '../services/LockService';
// Generates Hex payload and "sends" it
await lockService.openDoor('AI07F1234567'); 
```

## 3. Financials & Accounting (UGX Market)
**Service:** `src/services/AccountingService.js`

| Plan | Price (UGX) | Features |
|:--- |:--- |:--- |
| **Basic** | 100,000 | 5 Locks, 10 Users |
| **Pro** | 300,000 | 20 Locks, Unlimited Users (Popular) |
| **Enterprise** | Custom | SSO, Dedicated Manager |

## 4. Admin Dashboard Data
| Method | Endpoint | Description |
|:--- |:--- |:--- |
| GET | `/api/dashboard/admin-stats` | Returns Revenue (UGX), Active Locks, User Count |
| GET | `/api/devices` | Returns list of seeded Smart Locks |

## 5. Next Integration Steps
1. **Connect WebSocket/UDP**: Replace `_mockSend` in `LockService.js` with actual WebSocket or socket.io client to talk to the physical bridge.
2. **Live Payment**: Integrate mobile money payment gateway for UGX collection on `Financials.jsx`.
