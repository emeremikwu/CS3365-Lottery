import { Router } from 'express';
import catchAsync from '../utils/catchAsync.js';
import validate from '../middlewares/validate.js';
import { signin, signup, updateMe } from '../validationSchemas/authSchema.js';
import authenticate from '../middlewares/authenticate.js';
import AuthController from '../controllers/authController.js';

const router = Router();

router.post('/signup', validate(signup), catchAsync(AuthController.signup));
router.post('/signin', validate(signin), catchAsync(AuthController.signin));
router.post('/signout', catchAsync(AuthController.signout));

router.get('/current', authenticate(), catchAsync(AuthController.current)); // get basic info about the user
router.get('/me', authenticate(), catchAsync(AuthController.getMe)); // get full info about the user

router.put('/me', authenticate(), validate(updateMe), catchAsync(AuthController.updateMe));

/* router.put('', (req, res) => {
	 )
}); */

export default router;
