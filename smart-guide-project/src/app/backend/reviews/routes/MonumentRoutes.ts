import { Router } from 'express'
import { monumentController } from '../controller/MonumentController.js'
import { reviewController } from '../controller/ReviewController.js'

const router = Router();

router.get("/information", monumentController.getMonumentsInformation);
router.post("/information/one", monumentController.getMonumentByName);
router.post('/information/review', reviewController.createReview);
router.post('/information/reviews', reviewController.getReviewsByMonumentName);

export default router;
