import { Response, NextFunction } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      const boards = await BoardModel.find({ userId: req.user.id });
      res.send(boards);
    }
  } catch (err) {
    next(err);
  }
};

export const getBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      const boards = await BoardModel.findById(req.params.boardId);
      res.send(boards);
    }
  } catch (err) {
    next(err);
  }
};

export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      res.sendStatus(401);
    } else {
      const newBoard = new BoardModel({
        title: req.body.title,
        userId: req.user.id,
      });
      const savedBoard = await newBoard.save();
      res.send(savedBoard);
    }
  } catch (err) {
    next(err);
  }
};

export const joinBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  console.log("server socket io join", socket.user);
  socket.join(data.boardId);
};

export const leaveBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  console.log("server socket io leave", data.boardId);
  socket.leave(data.boardId);
};
