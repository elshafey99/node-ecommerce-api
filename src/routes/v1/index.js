import { Router } from 'express';
import productRoutes from './product.routes.js';

// Like Route::prefix('api/v1')->group(...) in routes/api.php.
const router = Router();

router.use('/products', productRoutes);

export default router;
