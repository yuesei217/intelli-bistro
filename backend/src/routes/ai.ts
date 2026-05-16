import { Router, Request, Response } from 'express';
import { processOrder } from '../services/aiService';
import { AIOrderRequest } from '../types';

const router = Router();

router.post('/order', async (req: Request, res: Response) => {
  const { message, cart = [], history = [] } = req.body as AIOrderRequest;
  const clientIp = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress;

  console.log(`[ai/order] ← ${clientIp} | msg: "${message}" | cart: ${cart.length} items | history: ${history.length}`);

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const result = await processOrder({ message, cart, history });
  console.log(`[ai/order] → reply: "${result.reply.slice(0, 80)}..." | actions: ${result.actions.length}`);
  res.json(result);
});

export default router;
