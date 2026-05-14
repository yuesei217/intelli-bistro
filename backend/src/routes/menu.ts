import { Router } from 'express';
import { MENU_ITEMS } from '../data/menu';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: MENU_ITEMS });
});

export default router;
