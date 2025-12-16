import { Router } from 'express';
import { monumentController } from '../controller/MonumentController.js';
const router = Router();
router.get("/information", monumentController.getMonumentsInformation);
export default router;
