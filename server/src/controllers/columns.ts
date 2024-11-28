import { NextFunction, Response } from "express";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import ColumnModel from "../models/column";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helpers";

export const getColumns = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      const columns = await ColumnModel.find({ boardId: req.params.boardId });
      res.send(columns);
    }
  } catch (err) {
    next(err);
  }
};

export const createColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; title: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.columnsCreateFailure,
        "User is not authorized"
      );
      return;
    }
    const newColumn = new ColumnModel({
      title: data.title,
      boardId: data.boardId,
      userId: socket.user.id,
    });

    const savedColumn = await newColumn.save();
    io.to(data.boardId).emit(SocketEventsEnum.columnsCreateSucess, savedColumn);
    console.log(savedColumn);
  } catch (err) {
    socket.emit(SocketEventsEnum.columnsCreateFailure, getErrorMessage(err));
  }
};

export const deleteColumn = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; columnId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.columnDeleteFailure,
        "User is not authorized"
      );
      return;
    }
    await ColumnModel.deleteOne({ _id: data.columnId });
    io.to(data.boardId).emit(
      SocketEventsEnum.columnDeleteSucess,
      data.columnId
    );
  } catch (err) {
    socket.emit(SocketEventsEnum.columnDeleteFailure, getErrorMessage(err));
  }
};
