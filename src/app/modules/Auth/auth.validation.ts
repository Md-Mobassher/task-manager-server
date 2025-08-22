import z from 'zod';

const createUserValidationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Email must be a valid email address.',
    }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const AuthValidation = {
  createUserValidationSchema,
  loginValidationSchema,
};
