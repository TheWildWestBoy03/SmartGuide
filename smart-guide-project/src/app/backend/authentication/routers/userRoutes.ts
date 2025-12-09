import { Router } from 'express'
import { userController } from '../controller/UserController.js'

const router = Router();

router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

export default router;