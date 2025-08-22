import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { exclude } from '../../helper/exclude';
import { jwtHelpers } from '../../helper/jwtHelpers';
import prisma from '../../shared/prisma';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { AuthUtils } from './auth.utils';

const register = async (req: Request): Promise<Partial<User>> => {
  const { name, email, phoneNumber, password } = req.body;
  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User already exists');
  }

  // Hash the password
  const hashedPassword: string = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // Save user details along with OTP and its expiry in the database
  const result = await prisma.user.create({
    data: {
      name: name,
      email: email,
      passwordHash: hashedPassword,
    },
  });

  // Remove sensitive data
  const safeUser = exclude(result, [
    'passwordHash',
    'isDeleted',
    'createdAt',
    'updatedAt',
  ]);

  return safeUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  // Find user by email with role and status included
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Check if user is deleted before checking the password
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is Deleted!!!');
  }

  // Check password only if the user exists and is not deleted
  if (
    isUserExist.passwordHash &&
    !(await AuthUtils.comparePasswords(password, isUserExist.passwordHash))
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Password is incorrect');
  }

  const { id: userId, role } = isUserExist;

  // Generate JWT tokens
  const accessToken = jwtHelpers.createToken(
    { userId, role, email },
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );

  return {
    email,
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  register,
  loginUser,
};
