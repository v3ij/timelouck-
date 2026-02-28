const axios = require('axios');
const crypto = require('crypto');

class LockProvider {
    constructor() {
        this.apiKey = process.env.HARDWARE_API_KEY;
        this.baseUrl = process.env.HARDWARE_API_URL || 'https://api.smartlock-provider.com/v1';
    }

    /**
     * Unlock a specific device
     * @param {string} deviceId 
     */
    async unlock(deviceId) {
        console.log(`[Hardware] Requesting unlock for ${deviceId}...`);

        if (!process.env.HARDWARE_API_KEY) {
            console.warn('[Hardware] Missing API Key. Simulating success.');
            return { success: true, message: "Simulated Unlock" };
        }

        try {
            const response = await axios.post(`${this.baseUrl}/devices/${deviceId}/unlock`, {}, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            return response.data;
        } catch (error) {
            console.error('[Hardware] Unlock failed:', error.message);
            throw new Error('Hardware connection failed');
        }
    }

    /**
     * Sync user credentials to the lock
     * @param {string} deviceId 
     * @param {object} userData 
     */
    async syncUsers(deviceId, userData) {
        console.log(`[Hardware] Syncing user ${userData.id} to device ${deviceId}...`);
        // Implementation would POST user data to the lock cloud
        return { success: true, status: 'synced' };
    }

    /**
     * Fetch access logs from the device
     * @param {string} deviceId 
     */
    async getLogs(deviceId) {
        console.log(`[Hardware] Fetching logs for ${deviceId}...`);
        return [
            { id: 1, event: 'UNLOCK', timestamp: new Date().toISOString() }
        ];
    }
}

module.exports = new LockProvider();
