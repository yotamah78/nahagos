import { Router } from 'express';
import * as driverController from './driver.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { requireVerifiedDriver } from '../../middleware/verifiedDriver.middleware';

const router = Router();

router.use(authenticate);

// Public profile (any authenticated user)
router.get('/profile/:driverId', driverController.getPublicProfile);

// Driver-only routes
router.post('/profile', requireRole('DRIVER'), driverController.upsertProfile);
router.get('/profile', requireRole('DRIVER'), driverController.getMyProfile);
router.get('/my-jobs', requireRole('DRIVER'), driverController.getMyJobs);
router.get('/earnings', requireRole('DRIVER'), driverController.getEarnings);
router.patch('/job/:requestId/status', requireRole('DRIVER'), driverController.updateJobStatus);

// Verified driver only
router.get('/jobs', requireRole('DRIVER'), requireVerifiedDriver, driverController.getAvailableJobs);

export default router;
