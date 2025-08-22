import catchAsync from '@/app/shared/catchAsync';
import pick from '@/app/shared/pick';
import sendResponse from '@/app/shared/sendResponse';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TaskFilterableFields } from './task.constant';
import { TaskServices } from './task.service';

const createATask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskServices.createATask(req);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Task created successfully',
    data: result,
  });
});

const getFilteredTask = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, TaskFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await TaskServices.getFilteredTask(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getATask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.getATask(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task retrieved successfully',
    data: result,
  });
});

const updateATask = catchAsync(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;

  const result = await TaskServices.updateATask(taskId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

const deleteATask = catchAsync(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;

  const result = await TaskServices.deleteATask(taskId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Task deleted successfully',
      data: null,
    });
  }
});

export const TaskControllers = {
  createATask,
  getFilteredTask,
  getATask,
  updateATask,
  deleteATask,
};
