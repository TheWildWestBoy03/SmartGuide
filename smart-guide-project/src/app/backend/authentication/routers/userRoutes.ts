import { Router } from 'express'
import { userController } from '../controller/UserController.js'

const router = Router();

router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/status", userController.getUserStatus);
router.post("/logout", userController.logoutUser);
router.post("/get-user", userController.findUserIdByEmail);
router.post("/user-retrieve", userController.retrieveUserById);
router.post("/delete", userController.deleteUser);

export default router;
