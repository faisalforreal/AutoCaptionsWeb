import { Request, Response } from 'express';
import { DodoService } from '../services/dodo.service';

export class PaymentController {
  static async createSupportCheckout(req: Request, res: Response): Promise<void> {
    try {
      const { amount, returnUrl } = req.body;
      const parsedAmount = typeof amount === 'number' ? amount : (amount ? parseFloat(amount) : undefined);

      const result = await DodoService.createSupportCheckout(parsedAmount, returnUrl);
      res.status(200).json({
        success: true,
        sessionId: result.sessionId,
        checkoutUrl: result.checkoutUrl
      });
    } catch (error: any) {
      console.error('[PaymentController] Error creating support session:', error?.message || error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Failed to initialize creator support checkout session'
      });
    }
  }
}
