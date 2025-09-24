import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { getBalance, credit, debit } from '../controllers/walletController';

const router = Router();

router.get('/balance', requireAuth, async (req: AuthRequest, res) => getBalance(req, res));
router.post('/credit', requireAuth, async (req: AuthRequest, res) => credit(req, res));
router.post('/debit', requireAuth, async (req: AuthRequest, res) => debit(req, res));

export default router;


