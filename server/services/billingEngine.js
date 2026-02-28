/**
 * Billing Engine for Cortex SaaS
 * Handles calculation of time-based access deductions.
 */

/**
 * Calculates time-based deduction and revenue splits for the system owner.
 * @param {Date|string|number} checkIn - The check-in timestamp
 * @param {Date|string|number} checkOut - The check-out timestamp
 * @param {Object} rateConfig - Configuration object { type: 'hourly'|'fixed', rate: Number }
 * @returns {Object} Deduction details including system fees
 */
const calculateDeduction = (checkIn, checkOut, rateConfig) => {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    // Difference in hours, minimum 0
    const diffHours = Math.max(0, (checkOutTime - checkInTime) / (1000 * 60 * 60));

    let deduction = 0;

    if (rateConfig && rateConfig.type === 'hourly') {
        deduction = diffHours * rateConfig.rate;
    } else if (rateConfig && rateConfig.type === 'fixed') {
        deduction = rateConfig.rate;
    }

    // System Fee (5%) for Super Admin (Cortex Owner)
    const systemFee = deduction * 0.05;

    // Remaining revenue for the Tenant (School/Hotel)
    const tenantRevenue = deduction - systemFee;

    return {
        totalDeducted: Number(deduction.toFixed(2)),
        systemFee: Number(systemFee.toFixed(2)),
        tenantRevenue: Number(tenantRevenue.toFixed(2)),
        durationHours: Number(diffHours.toFixed(2))
    };
};

module.exports = {
    calculateDeduction
};
