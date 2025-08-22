import { z } from 'zod';

const createTaskValidationSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskValidationSchema = z.object({
  title: z.string().min(1, 'Task title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
});

export const TaskValidation = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
};
