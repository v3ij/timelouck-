/**
 * Mock SMS Service integration with providers like Africa's Talking or Twilio.
 */

const sendSMS = async (phone, message) => {
    // In a real production scenario, this is where we would call the third-party API.
    // e.g., using axios to POST to Africa's Talking API

    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log(`\n====== [SMS DISPATCHED to ${phone}]: ${message} ======\n`);
            resolve(true);
        }, 500);
    });
};

module.exports = {
    sendSMS
};
