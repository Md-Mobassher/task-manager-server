import config from '@/app/config';
import AppError from '@/app/errors/AppError';
import { exclude } from '@/app/helper/exclude';
import { paginationHelpers } from '@/app/helper/paginationHelper';
import { IPaginationOptions } from '@/app/interface/iPaginationOptions';
import {
  UserEnumFields,
  UserSearchAbleFields,
} from '@/app/modules/User/user.constant';
import { IUserFilterRequest } from '@/app/modules/User/user.interface';
import prisma from '@/app/shared/prisma';
import { Prisma, User } from '@prisma/client';
import httpStatus from 'http-status';

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: UserSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData)
        .map(key => {
          const value = (filterData as any)[key];

          // Skip empty values (especially important for enums)
          if (value === undefined || value === '') {
            return {};
          }

          if (UserEnumFields.includes(key)) {
            return {
              [key]: {
                equals: value,
              },
            };
          }

          return {
            [key]: {
              equals: value,
              mode: 'insensitive',
            },
          };
        })
        .filter(condition => Object.keys(condition).length > 0), // remove empty objects
    });
  }
  andConditions.push({
    email: {
      not: config.super_admin.email,
    },
  });

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const users = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : [
            {
              createdAt: 'desc',
            },
          ],
  });

  // Exclude sensitive fields
  const safeUsers = users.map(user => exclude(user, ['passwordHash']));

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: safeUsers, // Return users without sensitive data
  };
};

const getSingleUser = async (id: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const safeUser = exclude(user, ['passwordHash']);

  return safeUser;
};

const getMyProfile = async (userId: string): Promise<Partial<User>> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const safeUser = exclude(user, ['passwordHash']);

  return safeUser;
};

export const UserServices = {
  getMyProfile,
  getAllUsers,
  getSingleUser,
};
