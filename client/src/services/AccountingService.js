
/**
 * ACCOUNTING & PRICING SERVICE
 * Strictly matches the provided PDF context for African Market (UGX).
 */

export const SUBSCRIPTION_PLANS = {
    BASIC: {
        id: 'basic',
        name: 'Basic',
        price: 100000,
        currency: 'UGX',
        period: 'monthly',
        features: ['Up to 5 Smart Locks', '10 User Accounts', 'Basic Access Logs', 'Email Support']
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        price: 300000,
        currency: 'UGX',
        period: 'monthly',
        features: ['Up to 20 Smart Locks', 'Unlimited Users', 'Real-time Audit Logs', 'Remote Unlock', 'Priority Support']
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise',
        price: 0, // Custom
        currency: 'UGX',
        period: 'monthly',
        features: ['Unlimited Smart Locks', 'SSO Integration', 'Custom Data Retention', 'Dedicated Account Manager']
    }
};

class AccountingService {

    /**
     * Calculate Revenue based on active users and their plans
     * @param {Array} users - List of user objects
     * @returns {Object} Revenue report
     */
    calculateRevenue(users) {
        let totalRevenue = 0;
        let breakdown = {
            basic: 0,
            pro: 0,
            enterprise: 0
        };

        users.forEach(user => {
            // Assuming user object has a 'plan' field. Default to 'basic' if missing for simulation.
            const planKey = (user.plan || 'basic').toUpperCase();

            if (SUBSCRIPTION_PLANS[planKey]) {
                const amount = SUBSCRIPTION_PLANS[planKey].price;
                totalRevenue += amount;
                if (breakdown[planKey.toLowerCase()] !== undefined) {
                    breakdown[planKey.toLowerCase()] += amount;
                }
            }
        });

        return {
            currency: 'UGX',
            total: totalRevenue,
            formattedTotal: `UGX ${totalRevenue.toLocaleString()}`,
            breakdown
        };
    }

    /**
     * Get Plan Details by ID
     * @param {String} planId 
     */
    getPlan(planId) {
        const key = planId.toUpperCase();
        return SUBSCRIPTION_PLANS[key] || null;
    }
}

export const accountingService = new AccountingService();
