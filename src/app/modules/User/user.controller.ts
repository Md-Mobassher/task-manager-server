import config from '@/app/config';
import { jwtHelpers } from '@/app/helper/jwtHelpers';
import { UserFilterableFields } from '@/app/modules/User/user.constant';
import { UserServices } from '@/app/modules/User/user.service';
import catchAsync from '@/app/shared/catchAsync';
import pick from '@/app/shared/pick';
import sendResponse from '@/app/shared/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await UserServices.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User retrieved successfully!',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization as string;
  const { userId } = jwtHelpers.verifyToken(
    token,
    config.jwt.access_secret as string,
  );
  const result = await UserServices.getMyProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  getMyProfile,
};
