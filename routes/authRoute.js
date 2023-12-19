import { Router } from 'express';
import catchAsync from '../utils/catchAsync.js';
import validate from '../middlewares/validate.js';
import authValidation from '../validationSchemas/authSchema.js';
import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.post('/signout', validate(authValidation.signout), catchAsync(authController.signout));
// (req, res, next) => {res.redirect("/profile.html")}));

router.get('/current', catchAsync(authenticate), catchAsync(authController.current)); // get basic info about the user
router.get('/me', catchAsync(authenticate), catchAsync(authController.getMe)); // get full info about the user

router.put('/me', catchAsync(authenticate), validate(authValidation.updateMe), catchAsync(authController.updateMe));

export default router;
