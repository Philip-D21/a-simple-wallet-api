import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { pool, testConnection } from './db/pool';
import authRouter from './routes/auth';
import walletRouter from './routes/wallet';
import transactionsRouter from './routes/transactions';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/db-health', async (_req, res) => {
  try {
    await testConnection();
    const { rows } = await pool.query('SELECT NOW() as now');
    res.status(200).json({ status: 'ok', time: rows[0]?.now });
  } catch (error) {
    console.error('Database health check failed', error);
    res.status(500).json({ status: 'error' });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRouter);
app.use('/wallet', walletRouter);
app.use('/transactions', transactionsRouter);


app.listen(env.port, () => {
  console.log(`Server listening on http://localhost:${env.port}`);
});


