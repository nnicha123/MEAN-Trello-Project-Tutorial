import { Document, Schema } from "mongoose";

export interface Task {
  title: string;
  description?: string;
  userId: Schema.Types.ObjectId;
  columnId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDocument extends Document, Task {}
