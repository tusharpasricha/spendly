import express from 'express';
import { getStats, getCategoryStats } from '../controllers/stats.controller';

const router = express.Router();

// Routes
router.get('/', getStats);
router.get('/category', getCategoryStats);

export default router;

