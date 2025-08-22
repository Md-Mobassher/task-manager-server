// cgcsbd-server/src/app/modules/User/user.validation.ts

import z from 'zod';

const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  phoneNumber: z.string().min(11).max(14).optional(),
  isDeleted: z.boolean().optional(),
  address: z.string().optional(),
  status: z
    .string(z.enum(['PENDING', 'ACTIVE', 'BLOCKED']))
    .nullable()
    .optional(),
  emailVerified: z.boolean().nullable().optional(),
  token: z.number().nullable().optional(),
  biodataVisibility: z
    .string(z.enum(['PUBLIC', 'PRIVATE']))
    .nullable()
    .optional(),
});

const updateMyProfileValidationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  phoneNumber: z.string().min(11).max(14).optional(),
  address: z.string().optional(),
});

const changeUserStatus = z.object({
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
});

export const UserValidation = {
  updateUserValidationSchema,
  updateMyProfileValidationSchema,
  changeUserStatus,
};
