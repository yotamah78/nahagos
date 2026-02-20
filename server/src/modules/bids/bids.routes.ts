import { Router } from 'express';
import * as bidsController from './bids.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { requireVerifiedDriver } from '../../middleware/verifiedDriver.middleware';

const router = Router();

router.use(authenticate);

router.get('/request/:requestId', bidsController.getBidsForRequest);
router.post('/', requireRole('DRIVER'), requireVerifiedDriver, bidsController.submitBid);
router.patch('/:id', requireRole('DRIVER'), bidsController.updateBid);
router.delete('/:id', requireRole('DRIVER'), bidsController.withdrawBid);

export default router;
