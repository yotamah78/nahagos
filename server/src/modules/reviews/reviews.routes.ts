import { Router } from 'express';
import * as reviewsController from './reviews.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', requireRole('CUSTOMER'), reviewsController.submitReview);
router.get('/driver/:driverId', reviewsController.getDriverReviews);
router.get('/request/:requestId', reviewsController.getRequestReview);

export default router;
