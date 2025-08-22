import auth from '@/app/middlewares/auth';
import { UserControllers } from '@/app/modules/User/user.controller';
import { UserRole } from '@prisma/client';
import express from 'express';

const router = express.Router();

router.get(
  '/',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.getAllUsers,
);

router.get(
  '/me',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  UserControllers.getMyProfile,
);

router.get(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  UserControllers.getSingleUser,
);

export const UserRoutes = router;
