import { AuthRoutes } from '@/app/modules/Auth/auth.routes';
import { TaskRoutes } from '@/app/modules/Task/task.routes';
import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.routes';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/tasks', route: TaskRoutes },
  { path: '/users', route: UserRoutes },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
