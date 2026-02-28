/**
 * STRICT HARDWARE PROTOCOL SERVICE
 * Based on Java SDK: com.timmy.controller.AllController
 */

class LockService {
    constructor() {
        this.baseUrl = '/api/hardware';
    }

    /**
     * GENERATES SPECIFIC BYTE ARRAY / HEX STRING
     * As requested for strict hardware compliance.
     * Logic: Converts the JSON command string (from Java SDK) into a Hex representation.
     */
    generateUnlockCommand(lockId, doorNum = 1) {
        // EXACT format from Java: String message="{\"cmd\":\"opendoor\""+",\"doornum\":"+doorNum+"}";
        const jsonCommand = `{"cmd":"opendoor","doornum":${doorNum}}`;
        return this._stringToHex(jsonCommand);
    }

    /**
     * Send "opendoor" command
     * Matches Java: String message="{\"cmd\":\"opendoor\""+",\"doornum\":"+doorNum+"}";
     */
    async openDoor(deviceSn, doorNum = 1) {
        const payload = {
            cmd: "opendoor",
            doornum: doorNum
        };
        const hexPayload = this.generateUnlockCommand(deviceSn, doorNum);
        return this.sendToDevice(deviceSn, hexPayload);
    }

    /**
     * Sync Time
     */
    async syncTime(deviceSn) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const jsonCommand = `{"cmd":"settime","cloudtime":"${now}"}`;
        return this.sendToDevice(deviceSn, this._stringToHex(jsonCommand));
    }

    /**
     * Get Logs
     */
    async getLogs(deviceSn) {
        const jsonCommand = `{"cmd":"getalllog","stn":true}`;
        return this.sendToDevice(deviceSn, this._stringToHex(jsonCommand));
    }

    /**
     * MOCK SEND TO DEVICE
     * Logs: "Connecting to [lockId]... Sending [HexCode]..."
     */
    async sendToDevice(deviceSn, commandHex) {
        console.log(`[HARDWARE] Connecting to ${deviceSn}...`);
        console.log(`[HARDWARE] Sending HexBytes: ${commandHex}`);

        // Decode back to string for readability/debugging
        const commandString = this._hexToString(commandHex);
        console.log(`[HARDWARE] Decoded Command: ${commandString}`);

        // Mock Network Delay
        await new Promise(r => setTimeout(r, 800));

        return { success: true, message: "Command Sent", timestamp: new Date() };
    }

    // --- UTILITIES ---

    _stringToHex(str) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += '' + str.charCodeAt(i).toString(16);
        }
        return hex;
    }

    _hexToString(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }
}

export const lockService = new LockService();
