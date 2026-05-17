const pool = require('../config/db');

/**
 * UTILITY: Partial JSONB Update Helper
 * Generates SQL for updating only provided keys in a JSONB column without overwriting the rest.
 */
const getJsonbPartialUpdateSql = (columnName, paramIndex) => {
    // COALESCE ensures if it's currently null, it starts as an empty object '{}' before concatenating.
    return `COALESCE(${columnName}, '{}'::jsonb) || $${paramIndex}::jsonb`;
};

/**
 * GET /api/profiles/me
 * Merges basic user info, user_profiles table, and metadata based on tenant_type
 */
const getMyProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 999; // Mock auth

        // 1. Fetch User and joined Tenant data
        const userQuery = `
            SELECT 
                u.id, u.full_name, u.email, u.role, u.is_biometric_enrolled, u.metadata as user_metadata,
                t.id as tenant_id, t.name as tenant_name, t.type as tenant_type, t.metadata as tenant_metadata
            FROM users u
            JOIN tenants t ON u.tenant_id = t.id
            WHERE u.id = $1
        `;
        const userRes = await pool.query(userQuery, [userId]);

        if (userRes.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const coreUser = userRes.rows[0];

        // 2. Fetch Extended User Profile
        const profileRes = await pool.query(`SELECT * FROM user_profiles WHERE user_id = $1`, [userId]);
        const extendedProfile = profileRes.rows.length > 0 ? profileRes.rows[0] : {};

        res.json({
            status: 'success',
            data: {
                ...coreUser,
                profile_details: extendedProfile
            }
        });

    } catch (error) {
        console.error('Fetch profile error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch profile' });
    }
};

/**
 * PUT /api/profiles/me
 * Handles updating of both the standard extended profile AND the flexible metadata.
 */
const updateMyProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 999; // Mock auth
        const { standard_fields, flexible_metadata } = req.body;

        await pool.query('BEGIN');

        // 1. Update Flexible Metadata (Partial Update)
        if (flexible_metadata && Object.keys(flexible_metadata).length > 0) {
            const updateSql = `
                UPDATE users 
                SET metadata = ${getJsonbPartialUpdateSql('metadata', 1)}
                WHERE id = $2
            `;
            await pool.query(updateSql, [JSON.stringify(flexible_metadata), userId]);
        }

        // 2. Upsert Standard Fields (user_profiles table)
        if (standard_fields) {
            const { national_id, passport_number, address, emergency_contact_name, emergency_contact_phone } = standard_fields;

            // Check if profile exists
            const checkRes = await pool.query('SELECT id FROM user_profiles WHERE user_id = $1', [userId]);

            if (checkRes.rows.length > 0) {
                // Update
                await pool.query(`
                    UPDATE user_profiles 
                    SET national_id = COALESCE($1, national_id),
                        passport_number = COALESCE($2, passport_number),
                        address = COALESCE($3, address),
                        emergency_contact_name = COALESCE($4, emergency_contact_name),
                        emergency_contact_phone = COALESCE($5, emergency_contact_phone),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $6
                `, [national_id, passport_number, address, emergency_contact_name, emergency_contact_phone, userId]);
            } else {
                // Insert
                await pool.query(`
                    INSERT INTO user_profiles 
                    (user_id, national_id, passport_number, address, emergency_contact_name, emergency_contact_phone)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [userId, national_id, passport_number, address, emergency_contact_name, emergency_contact_phone]);
            }
        }

        await pool.query('COMMIT');

        res.json({ status: 'success', message: 'Profile updated successfully' });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Update profile error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getJsonbPartialUpdateSql
};
