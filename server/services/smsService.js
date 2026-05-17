/**
 * Mock SMS Service integration with providers like Africa's Talking or Twilio.
 * In addition to console dispatch, it automatically logs SMS as notifications in the database.
 */
const pool = require('../config/db');

const sendSMS = async (phone, message, userId = null) => {
    return new Promise(async (resolve) => {
        setTimeout(async () => {
            console.log(`\n====== [SMS DISPATCHED to ${phone}]: ${message} ======\n`);
            
            try {
                let resolvedUserId = userId;
                if (!resolvedUserId && phone) {
                    // Try to resolve user_id by looking up the phone number in our db
                    const userResult = await pool.query(
                        'SELECT id FROM users WHERE phone_number = $1 OR phone_number LIKE $2 LIMIT 1', 
                        [phone, `%${phone.substring(phone.length - 9)}`]
                    );
                    if (userResult.rows.length > 0) {
                        resolvedUserId = userResult.rows[0].id;
                    }
                }

                // If user is resolved, save the notification to the DB
                if (resolvedUserId) {
                    await pool.query(
                        'INSERT INTO notifications (user_id, message, is_read) VALUES ($1, $2, $3)',
                        [resolvedUserId, message, false]
                    );
                    console.log(`[SMS Logged] Persisted SMS notification to database for user ID: ${resolvedUserId}`);
                } else {
                    // Default to seeded admin / first user if no matching user found
                    await pool.query(
                        'INSERT INTO notifications (user_id, message, is_read) VALUES ($1, $2, $3)',
                        [1, message, false]
                    );
                    console.log(`[SMS Logged] Persisted SMS notification to database under default user`);
                }
            } catch (error) {
                console.error('[SMS Logger Error] Failed to write notification to DB:', error);
            }
            
            resolve(true);
        }, 500);
    });
};

module.exports = {
    sendSMS
};
