import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { AuthServices } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User Registration successfull!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const AuthControllers = {
  register,
  loginUser,
};
