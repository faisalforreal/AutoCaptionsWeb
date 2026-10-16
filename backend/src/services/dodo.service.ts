import DodoPayments from 'dodopayments';

export class DodoService {
  private static client: DodoPayments | null = null;

  private static getClient(): DodoPayments {
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    if (!apiKey) {
      throw new Error('DODO_PAYMENTS_API_KEY is not configured in backend environment.');
    }

    if (!this.client) {
      const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'live_mode' | 'test_mode') || 'test_mode';
      this.client = new DodoPayments({
        bearerToken: apiKey,
        environment
      });
    }

    return this.client;
  }

  static async createSupportCheckout(amountInDollars?: number, returnUrl?: string) {
    const productId = process.env.DODO_PAYMENTS_PRODUCT_ID;
    if (!productId) {
      throw new Error('DODO_PAYMENTS_PRODUCT_ID is not configured in backend environment.');
    }

    const client = this.getClient();

    // Convert dollar amount to cents if provided (minimum 100 cents = $1.00)
    let amountInCents: number | undefined;
    if (amountInDollars && !isNaN(amountInDollars) && amountInDollars >= 1) {
      amountInCents = Math.round(amountInDollars * 100);
    }

    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          ...(amountInCents ? { amount: amountInCents } : {})
        }
      ],
      return_url: returnUrl || process.env.FRONTEND_URL || 'https://autocaption.io'
    });

    return {
      sessionId: session.session_id,
      checkoutUrl: session.checkout_url
    };
  }
}
