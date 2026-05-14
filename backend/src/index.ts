import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import menuRouter from './routes/menu';
import aiRouter from './routes/ai';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use('/api/menu', menuRouter);
app.use('/api/ai', aiRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Bistro backend running on http://localhost:${PORT}`);
});
