import { Router, Request, Response } from 'express';
import { processOrder } from '../services/aiService';
import { AIOrderRequest } from '../types';

const router = Router();

router.post('/order', async (req: Request, res: Response) => {
  const { message, cart = [], history = [] } = req.body as AIOrderRequest;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const result = await processOrder({ message, cart, history });
  res.json(result);
});

export default router;
