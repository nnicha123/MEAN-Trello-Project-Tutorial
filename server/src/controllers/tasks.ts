import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import TaskModel from "../models/task";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helpers";

export const getTasks = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      const tasks = await TaskModel.find({ boardId: req.params.boardId });
      res.send(tasks);
    }
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string; columnId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.tasksCreateFailure,
        "User is not authorized"
      );
    } else {
      const newTask = new TaskModel({
        title: data.title,
        userId: socket.user.id,
        boardId: data.boardId,
        columnId: data.columnId,
      });
      const savedTask = await newTask.save();
      io.to(data.boardId).emit(SocketEventsEnum.tasksCreateSucess, savedTask);
    }
  } catch (err) {
    socket.emit(SocketEventsEnum.columnsCreateFailure, getErrorMessage(err));
  }
};