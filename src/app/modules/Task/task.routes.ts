import auth from '@/app/middlewares/auth';
import validateRequest from '@/app/middlewares/validateRequest';
import { TaskControllers } from '@/app/modules/Task/task.controller';
import { TaskValidation } from '@/app/modules/Task/task.validation';
import { UserRole } from '@prisma/client';
import express from 'express';

const router = express.Router();

router.post(
  '/',
  auth([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER]),
  validateRequest(TaskValidation.createTaskValidationSchema),
  TaskControllers.createATask,
);

router.get('/', TaskControllers.getFilteredTask);

router.get('/:id', TaskControllers.getATask);

router.patch(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  validateRequest(TaskValidation.updateTaskValidationSchema),
  TaskControllers.updateATask,
);

router.delete(
  '/:id',
  auth([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER]),
  TaskControllers.deleteATask,
);

export const TaskRoutes = router;
