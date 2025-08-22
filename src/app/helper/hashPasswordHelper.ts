import config from '@/app/config';
import AppError from '@/app/errors/AppError';
import * as bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

export const hashedPassword = async (password: string): Promise<string> => {
  const saltRounds: number = Number(config.bcrypt_salt_rounds);
  try {
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err: any) {
    console.error('Error hashing password:', err);
    throw new AppError(httpStatus.BAD_REQUEST, 'Error hashing password');
  }
};
