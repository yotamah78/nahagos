import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', adminController.getStats);
router.get('/drivers/pending', adminController.getPendingDrivers);
router.get('/drivers/:id', adminController.getDriverDetail);
router.patch('/drivers/:id/verify', adminController.verifyDriver);
router.get('/requests', adminController.getAllRequests);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/suspend', adminController.suspendUser);

export default router;
