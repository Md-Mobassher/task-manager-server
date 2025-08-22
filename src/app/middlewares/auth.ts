import config from '@/app/config';
import AppError from '@/app/errors/AppError';
import catchAsync from '@/app/shared/catchAsync';
import prisma from '@/app/shared/prisma';
import { UserRole } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (requiredRoles: string[] = []) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Missing or malformed authorization token!',
        );
      }

      const token = authHeader;

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          token,
          config.jwt.access_secret as string,
        ) as JwtPayload;
      } catch {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Invalid or expired token!',
        );
      }

      const { userId, role, iat } = decoded;

      if (!userId || !role) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
      }

      // Fetch user, role, and status in ONE optimized query
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          isDeleted: true,
          role: true,
        },
      });

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User does not exist!');
      }
      if (user.isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is deleted!');
      }

      // ✅ Grant full access if the user is a SUPER_ADMIN
      if (user.role === UserRole.SUPER_ADMIN) {
        req.user = decoded as JwtPayload & { role: string };
        return next();
      }

      // ✅ Check role-based access for other users
      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Access denied!');
      }

      // ✅ Check route-specific permissions for non-superadmins
      req.user = decoded as JwtPayload & { role: string };
      next();
    },
  );
};

export default auth;
