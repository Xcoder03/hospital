import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { isLogin } from '../middlewares/islogin';

const router = Router();
const userController = new UserController();

router.post('/register', userController.registerUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.get('/:id', isLogin, userController.getUserProfile.bind(userController));
router.post('/verify-email', userController.verifyEmail.bind(userController));

export default router;
