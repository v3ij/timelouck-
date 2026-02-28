const WebSocket = require('ws');

class TuyaLockService {
    constructor() {
        this.wss = null;
        this.sessions = new Map(); // SN -> WebSocket
        this.port = process.env.HARDWARE_WS_PORT || 7788;
    }

    start() {
        this.wss = new WebSocket.Server({ port: this.port });
        console.log(`[Hardware] Tuya Lock Server started on port ${this.port}`);

        this.wss.on('connection', (ws, req) => {
            const ip = req.socket.remoteAddress;
            console.log(`[Hardware] New connection from ${ip}`);

            ws.on('message', (message) => {
                try {
                    const msgStr = message.toString();
                    console.log(`[Hardware] Received from ${ip}: ${msgStr}`);
                    const jsonMsg = JSON.parse(msgStr);
                    this.handleMessage(ws, jsonMsg);
                } catch (err) {
                    console.error('[Hardware] Message error:', err.message);
                }
            });

            ws.on('close', () => {
                // Find and remove session
                for (let [sn, socket] of this.sessions.entries()) {
                    if (socket === ws) {
                        console.log(`[Hardware] Device ${sn} disconnected`);
                        this.sessions.delete(sn);
                        break;
                    }
                }
            });
        });
    }

    handleMessage(ws, jsonMsg) {
        const cmd = jsonMsg.cmd;
        if (!cmd) return;

        switch (cmd) {
            case 'reg':
                this.handleRegistration(ws, jsonMsg);
                break;
            case 'sendlog':
                this.handleSendLog(ws, jsonMsg);
                break;
            case 'heartbeat': // Some devices might send this
            case 'gettime':
                this.handleGetTime(ws, jsonMsg);
                break;
            default:
                console.log(`[Hardware] Unknown command: ${cmd}`);
        }
    }

    handleRegistration(ws, jsonMsg) {
        const sn = jsonMsg.sn;
        if (sn) {
            this.sessions.set(sn, ws);
            console.log(`[Hardware] Device registered: ${sn}`);

            // Format time as yyyy-MM-dd HH:mm:ss
            const now = new Date();
            const cloudtime = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + ' ' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');

            // Response format from SDK: {"ret":"reg","result":true,"cloudtime":"..."}
            const response = {
                ret: 'reg',
                result: true,
                cloudtime: cloudtime
            };
            ws.send(JSON.stringify(response));
        }
    }

    handleSendLog(ws, jsonMsg) {
        // Log received logic
        const now = new Date();
        const cloudtime = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const response = {
            ret: 'sendlog',
            result: true,
            cloudtime: cloudtime,
            access: 1 // 1=Open, 0=Deny (Server Access Control Mode)
        };
        ws.send(JSON.stringify(response));
    }

    handleGetTime(ws, jsonMsg) {
        const now = new Date();
        const cloudtime = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');

        const response = {
            ret: 'gettime',
            result: true,
            cloudtime: cloudtime
        };
        // ws.send(JSON.stringify(response)); // Uncomment if often used for sync
    }

    /**
     * Unlock a specific device
     * @param {string} sn Device Serial Number
     */
    async unlockDoor(sn) {
        const ws = this.sessions.get(sn);
        if (!ws) {
            console.warn(`[Hardware] Device ${sn} not connected`);
            return { success: false, message: 'Device not connected' };
        }

        if (ws.readyState !== WebSocket.OPEN) {
            return { success: false, message: 'Device connection closed' };
        }

        console.log(`[Hardware] Sending unlock command to ${sn}`);
        // Command from SDK: {"cmd":"opendoor","doornum":1}
        const cmd = {
            cmd: "opendoor",
            doornum: 1
        };
        ws.send(JSON.stringify(cmd));
        return { success: true, message: 'Unlock command sent' };
    }

    getConnectedDevices() {
        return Array.from(this.sessions.keys());
    }
}

// Singleton instance
const tuyaLockService = new TuyaLockService();
module.exports = tuyaLockService;
