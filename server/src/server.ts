// ts-node allows the use of TypeScript directly with Node.js by transpiling TypeScript code to JavaScript on-the-fly during execution.
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth";
import cors from "cors";

// Create an instance of an Express application
const app = express();

// Create an HTTP server using the Express application
const httpServer = createServer(app);

// Create a Socket.IO server instance to handle WebSocket communication
const io = new Server(httpServer);

app.use(cors());

// to use body as json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is UP");
});

app.post("/api/users", usersController.register);

app.post("/api/users/login", usersController.login);

app.get("/api/user", authMiddleware, usersController.currentUser);

io.on("connection", () => {
  console.log("connect");
});

mongoose.connect("mongodb://localhost:27017/eltrello").then(() => {
  console.log("connected to mongodb");

  httpServer.listen(4001, () => {
    console.log("API is listening on port 4001");
  });
});
