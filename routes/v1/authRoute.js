"use strict";

import { Router } from 'express';
import catchAsync from "../../utils/catchAsync.js";
import validate from "../../middlewares/validate.js";
import authenticate from "../../middlewares/authenticate.js";
import authValidation from "../../validationSchemas/authSchema.js";
import authController from '../../controllers/authController.js';

const router = Router();

router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.post('/signout', validate(authValidation.signout), catchAsync(authController.signout));


router.get('/current', authenticate(), catchAsync(authController.current)); //get basic info about the user
router.get('/me', authenticate(), catchAsync(authController.getMe));        //get full info about the user

router.put('/me', authenticate(), validate(authValidation.updateMe), catchAsync(authController.updateMe));

export default router;
