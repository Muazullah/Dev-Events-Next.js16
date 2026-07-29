import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
});

export function formatAmountForStripe(amount: number, currency: string): number {
    // PKR and some currencies don't use decimal subunits
    const zeroDecimalCurrencies = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf', 'bhd', 'jod', 'kwd', 'omr', 'tnd'];
    
    const currencyLower = currency.toLowerCase();
    
    if (zeroDecimalCurrencies.includes(currencyLower)) {
        return Math.round(amount);
    }
    
    // Most currencies use cents (multiply by 100)
    return Math.round(amount * 100);
}

// Minimum amount check
export function getMinimumAmount(currency: string): number {
    const minimums: Record<string, number> = {
        usd: 0.50,
        pkr: 100, // ~$0.35 minimum, but Stripe might require more
        eur: 0.50,
        gbp: 0.30,
    };
    return minimums[currency.toLowerCase()] || 0.50;
}