const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const runDiagnosis = async () => {
    try {
        console.log('🔍 Starting Database Diagnosis...');

        // 1. Check access_logs columns and types
        const cols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'access_logs';
        `);

        const userIdCol = cols.rows.find(r => r.column_name === 'user_id');
        if (userIdCol) {
            console.log(`🧐 access_logs.user_id type: ${userIdCol.data_type}`);
            if (userIdCol.data_type === 'uuid') {
                console.warn('⚠️ SCHEMA MISMATCH: access_logs.user_id is UUID, but app uses INTEGER.');
                console.log('🔄 Renaming incompatible table to access_logs_backup_uuid...');
                await pool.query('ALTER TABLE access_logs RENAME TO access_logs_backup_uuid');
                console.log('✅ Renamed. New table will be created by init_schema.');
            }
        }

        // 2. Check transactions columns and types
        const tCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'transactions';
        `);

        const tUserIdCol = tCols.rows.find(r => r.column_name === 'user_id');
        if (tUserIdCol) {
            console.log(`🧐 transactions.user_id type: ${tUserIdCol.data_type}`);
            if (tUserIdCol.data_type === 'uuid') {
                console.warn('⚠️ SCHEMA MISMATCH: transactions.user_id is UUID.');
                console.log('🔄 Renaming incompatible table to transactions_backup_uuid...');
                await pool.query('ALTER TABLE transactions RENAME TO transactions_backup_uuid');
                console.log('✅ Renamed.');
            }
        }

        console.log('✅ Diagnosis & Cleanup Complete.');
        process.exit(0);

    } catch (err) {
        console.error('❌ DIAGNOSIS FAILED:', err);
        process.exit(1);
    }
};

runDiagnosis();
