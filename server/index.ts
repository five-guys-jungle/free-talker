import express, { Express, Request, Response } from "express";
import http from "http";
import cors from "cors";
import axios from "axios";
import path from "path";
import { Router } from "express";
import { upload, interact, grammerCorrection } from "./controllers/interaction";
import { socketEventHandler } from "./controllers/gameSocket";
import { interactSocketEventHandler } from "./controllers/interactSocket";
import { freedialogsocketEventHandler } from "./controllers/voiceController";   
import { Server as SocketIOServer, Socket } from "socket.io";

import { connectDB } from "./database/db";
import { connectDBLocal } from "./database/dbLocal";
import authRouter from "./routes/authRouter";

import { signup, login } from "./controllers/userController";
import dotenv from "dotenv";
// // import router from "./routes/basicRouter";
// // import http from 'http'; // Load in http module

// Production or Development server URl
// 서버 시작시 npm run build 로 시작하면 
// env.SERVER_URl = "https://seunghunshin.shop"
// 서버 시작시 npm run build-dev 로 시작하면
// env.SERVER_URl = "http://localhost:5000"
dotenv.config();
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.production" })
}
else {
    dotenv.config({ path: ".env.development" })
}
console.log("process.env.SERVER_URL: ", process.env.SERVER_URL);
const port = 5000;
const app = express();

const server = http.createServer(app);
const io = new SocketIOServer(server);

// export const IO = require("socket.io")(server)

io.on("connection", socketEventHandler);

const interactionSocket = io.of(`/interaction`);

const freedialogSocket = io.of(`/freedialog`);

// const allowedOrigins = [
//     "http://127.0.0.1:3000",
//     "http://127.0.0.1:5000",
//     "http://localhost:3000",
//     "http://localhost:5000",
// ];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.static(path.join(__dirname, "/audio/npc_audio")));
// app.use('/', require('./routes/basicRouter'));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("/audio/npc_audio/*", function (req: Request, res: Response) {
    console.log(path.join(__dirname, "audio/npc_audio", req.params[0]));
    res.sendFile(path.join(__dirname, "audio/npc_audio", req.params[0]));
});

interactionSocket.on("connection", interactSocketEventHandler);
freedialogSocket.on("connection", freedialogsocketEventHandler);
// app.post("/interact", upload.single("audio"), interact);
// app.use(Router);
app.use("/auth", authRouter);

// app.post("/signup", signup);
// app.post("/login", login);

if (process.env.NODE_ENV === "production") {
    console.log("Production Mode");
    connectDB()
        .then((db) => {
            server.listen(port);
            console.log(`gameServer is listening on port ${port}`);
        })
        .catch(console.error);
}
else {
    console.log("Development Mode");
    connectDBLocal()
        .then((db) => {
            server.listen(port);
            console.log(`gameServer is listening on port ${port}`);
        })
        .catch(console.error);
}

// export default router;

// Start the server
// server.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
