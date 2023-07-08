import { Server } from "Socket.IO";
import { NextApiRequest, NextApiResponse } from "next";
import { addMessage, getReport } from "../../lib/activeReports";
import { Message } from "../../types";

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  if (res.socket?.server?.io) {
    console.log("Socket is already running");
    res.end();
  }
  console.log("Socket is initializing");
  //@ts-ignore
  const io = new Server(res.socket.server);

  io.on("connection", (socket) => {
    // allows clients to join the room for their report
    // messages for a report will only be sent to clients in that room
    socket.on("join", (reportId) => {
      if (getReport(reportId)) {
        socket.join(reportId);
        console.log("Client joined room", reportId);
      }
    });
    socket.on("newMessage", (data, callback) => {
      const message = validateMessage(data);
      if (!message) console.log("invalid message", data);
      console.log("recieved message", message);
      const isNewMessage = addMessage(message);
      if (isNewMessage) {
        console.log("Forwarding message");
        socket.to(message.reportId).emit("newMessage", message);
      }
      callback();
    });
  });
  //@ts-ignore
  res.socket.server.io = io;
  res.end();
};

const validateMessage = (message: any): Message | null => {
  if (
    message &&
    "from" in message &&
    "timestamp" in message &&
    "text" in message &&
    "reportId" in message &&
    "id" in message
  )
    return message;
  console.log("invalid message", message);
  return null;
};

export default SocketHandler;
