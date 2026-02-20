import { Router } from 'express';
import * as requestsController from './requests.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('CUSTOMER'), requestsController.getMyRequests);
router.post('/', requireRole('CUSTOMER'), requestsController.createRequest);
router.get('/:id', requestsController.getRequestById);
router.delete('/:id', requireRole('CUSTOMER'), requestsController.cancelRequest);
router.patch('/:id/select-driver', requireRole('CUSTOMER'), requestsController.selectDriver);
router.patch('/:id/complete', requireRole('CUSTOMER'), requestsController.completeRequest);

export default router;
