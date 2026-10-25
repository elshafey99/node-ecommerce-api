import { Router } from 'express';
import { destroy, index, show, store, update } from '../../controllers/product.controller.js';

const router = Router();

// Express 5 forwards a rejected promise from an async handler to the error
// middleware. Express 4 did not: you wrapped every async action in an
// asyncHandler that called next(err). Laravel's exception handler has always
// done this for you, so we use the Express 5 behavior and skip that wrapper.
// Method names match a Laravel resource controller: index, show, store,
// update, destroy.

router.get('/', index);
router.get('/:id', show);
router.post('/', store);
// PUT replaces writable fields (name and price required). PATCH sends a subset.
router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', destroy);

export default router;
