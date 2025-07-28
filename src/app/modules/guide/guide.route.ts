import express from 'express';
import { GuideController } from './guide.controller';



const router = express.Router();

// POST /guide/apply
router.post('/apply', GuideController.applyAsGuide);

// POST /guide/approve/:id
router.post('/', GuideController.approveGuide);

// GET /guide
router.get('/', GuideController.getAllGuide);

export const GuideRoutes = router;