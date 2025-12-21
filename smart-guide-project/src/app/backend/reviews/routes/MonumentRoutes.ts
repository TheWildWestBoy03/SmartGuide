import { Router } from 'express'
import { monumentController } from '../controller/MonumentController.js'
import { reviewController } from '../controller/ReviewController.js'
import { OptionsController } from '../controller/OptionsController.js'

const router = Router();

router.get("/information", monumentController.getMonumentsInformation);
router.post("/monument-by-user", monumentController.getMonumentsByUser);
router.post("/information/one", monumentController.getMonumentByName);
router.post('/information/review', reviewController.createReview);
router.post('/information/reviews', reviewController.getReviewsByMonumentName);
router.post('/options', OptionsController.getOptionsByUserId);
router.post('/options/save', OptionsController.updateUserOptions);

export default router;
