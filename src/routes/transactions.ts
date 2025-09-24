import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { listTransactions } from '../controllers/transactionController';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res) => listTransactions(req, res));

export default router;


