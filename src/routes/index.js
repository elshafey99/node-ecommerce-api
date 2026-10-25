import { Router } from 'express';
import healthRoutes from './health.routes.js';
import v1Routes from './v1/index.js';

// Like routes/api.php. Health stays unversioned; resources live under /api/v1.
const router = Router();

router.use('/api/health', healthRoutes);
router.use('/api/v1', v1Routes);

export default router;
