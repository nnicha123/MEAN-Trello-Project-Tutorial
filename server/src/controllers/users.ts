import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import { UserDocument } from "../types/user.interface";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import { secret } from "../config";
import { ExpressRequestInterface } from "../types/expressRequest.interface";

const normalizeUser = (user: UserDocument) => {
  const token = jwt.sign({ id: user.id, email: user.email }, secret);
  return {
    email: user.email,
    username: user.username,
    id: user.id,
    token: `Bearer ${token}`,
  };
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = new UserModel({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    console.log({ newUser });
    const savedUser = await newUser.save();
    console.log({ savedUser });
    res.send(normalizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      res.status(422).json(messages);
    }
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );
    const errors = { emailOrPassword: "Incorrect email or password" };
    if (!user) {
      res.status(422).json(errors);
    } else {
      const isSamePassword = await user.validatePassword(req.body.password);
      if (!isSamePassword) {
        res.status(422).json(errors);
      } else {
        res.send(normalizeUser(user));
      }
    }
  } catch (err) {
    next(err);
  }
};

export const currentUser = (req: ExpressRequestInterface, res: Response) => {
  if (!req.user) {
    res.sendStatus(401);
  } else {
    res.send(normalizeUser(req.user));
  }
};
