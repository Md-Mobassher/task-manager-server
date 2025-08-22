// cgcsbd-server/src/app/modules/Auth/auth.routes.ts

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.createUserValidationSchema),
  AuthControllers.register,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

export const AuthRoutes = router;
