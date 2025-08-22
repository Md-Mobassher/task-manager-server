import AppError from '@/app/errors/AppError';
import { paginationHelpers } from '@/app/helper/paginationHelper';
import { IPaginationOptions } from '@/app/interface/iPaginationOptions';
import {
  TaskEnumFields,
  TaskSearchAbleFields,
} from '@/app/modules/Task/task.constant';
import { ITaskFilterRequest } from '@/app/modules/Task/task.interface';
import prisma from '@/app/shared/prisma';
import { Prisma, Task } from '@prisma/client';
import httpStatus from 'http-status';

const createATask = async (req: Record<string, any>): Promise<Task> => {
  const { title, description, status, priority, dueDate } = req.body;
  const userId = req.user.userId;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'PENDING',
      priority: priority || 'MEDIUM',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getFilteredTask = async (
  filters: ITaskFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: TaskSearchAbleFields.map(field => ({
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

          if (value === undefined || value === '') {
            return {};
          }

          if (TaskEnumFields.includes(key)) {
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
        .filter(condition => Object.keys(condition).length > 0),
    });
  }

  const whereConditons: Prisma.TaskWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.task.findMany({
    where: whereConditons,
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : [{ createdAt: 'desc' }],
  });

  const total = await prisma.task.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getATask = async (taskId: string) => {
  const task = await prisma.task.findUniqueOrThrow({
    where: {
      id: taskId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

const updateATask = async (
  taskId: string,
  data: Partial<Task>,
): Promise<Task> => {
  await prisma.task.findFirstOrThrow({
    where: {
      id: taskId,
    },
  });

  // If userId is being updated, check if the new user exists
  if (data.userId) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
  }

  const updateData: any = { ...data };

  // Convert dueDate string to Date if provided
  if (data.dueDate && typeof data.dueDate === 'string') {
    updateData.dueDate = new Date(data.dueDate);
  }

  const result = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deleteATask = async (taskId: string): Promise<Task> => {
  await prisma.task.findFirstOrThrow({
    where: {
      id: taskId,
    },
  });

  const result = await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return result;
};

export const TaskServices = {
  createATask,
  getFilteredTask,
  getATask,
  updateATask,
  deleteATask,
};
