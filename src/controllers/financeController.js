const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // Calculate Total Revenue (Sum of all TOPUP transactions)
        const revenueRes = await db.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'TOPUP'");
        const totalRevenue = parseFloat(revenueRes.rows[0].total || 0);

        // Calculate Total Expenses
        const expenseRes = await db.query("SELECT SUM(amount) as total FROM expenses");
        const totalExpenses = parseFloat(expenseRes.rows[0].total || 0);

        // Calculate Total Tax Collected
        const taxRes = await db.query("SELECT SUM(tax_amount) as total FROM invoices");
        const totalTax = parseFloat(taxRes.rows[0].total || 0);

        // Calculate PnL: (Revenue - Tax) - Expenses
        // Note: Tax is usually a liability, not income. Net Revenue = Gross - Tax.
        const netRevenue = totalRevenue - totalTax;
        const pnl = netRevenue - totalExpenses;

        res.json({
            gross_revenue: totalRevenue,
            total_expenses: totalExpenses,
            total_tax_liability: totalTax,
            net_profit_loss: pnl,
            currency: 'UGX'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateTaxSettings = async (req, res) => {
    try {
        const { vat_percentage } = req.body;
        if (vat_percentage === undefined) return res.status(400).json({ message: "VAT % required" });

        // Update the single row
        await db.query("UPDATE tax_settings SET vat_percentage = $1, updated_at = NOW()", [vat_percentage]);
        res.json({ message: "Tax settings updated", vat_percentage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTaxSettings = async (req, res) => {
    try {
        const resDb = await db.query("SELECT * FROM tax_settings LIMIT 1");
        res.json(resDb.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Internal Helper to calculate tax and record invoice
exports.processTransactionTax = async (client, userId, transactionId, amount) => {
    try {
        // Get current VAT
        const taxSettingRes = await client.query("SELECT vat_percentage FROM tax_settings LIMIT 1");
        const vatRate = parseFloat(taxSettingRes.rows[0]?.vat_percentage || 0);

        // Calculate Tax (assuming Amount is Inclusive of Tax)
        // Amount = Net * (1 + Rate/100)  =>  Net = Amount / (1 + Rate/100)
        // Tax = Amount - Net
        const netAmount = amount / (1 + (vatRate / 100));
        const taxAmount = amount - netAmount;

        // Create Invoice Record
        await client.query(
            "INSERT INTO invoices (user_id, transaction_id, amount, tax_amount) VALUES ($1, $2, $3, $4)",
            [userId, transactionId, amount, taxAmount]
        );

        return taxAmount;
    } catch (err) {
        console.error("Tax Calculation Failed:", err);
        // Don't fail the transaction just because tax calc failed, but log it critical
    }
};
