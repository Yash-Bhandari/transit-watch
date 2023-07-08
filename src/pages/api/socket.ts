import { Server } from "Socket.IO";
import { NextApiRequest, NextApiResponse } from "next";
import { Message } from "../../types";

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket?.server?.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    res.socket.server.io = initializeServerSocket(res);
  }
  res.end();
};

const initializeServerSocket = (res: NextApiResponse): Server => {
  const io = new Server(res.socket.server);

  io.on("connection", (socket) => {
    socket.on("newMessage", (data, callback) => {
      const message = validateMessage(data);
      console.log("recieved message", message)
      if (message) {
        console.log("Forwarding message")
        socket.broadcast.emit("newMessage", data);
      }
      callback()
    });
  });
  return io;
};

const validateMessage = (message: any): Message | null => {
  if (
    message &&
    "from" in message &&
    "timestamp" in message &&
    "text" in message &&
    "reportId" in message
  )
    return message;
  console.log("invalid message", message)
  return null;
};

export default SocketHandler;
