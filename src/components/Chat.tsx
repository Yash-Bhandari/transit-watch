import React, { useEffect, useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { FaPaperPlane } from "react-icons/fa";
import ShortUniqueId from "short-unique-id";
import io, { Socket } from "socket.io-client";
import { ActiveReport, Message } from "../types";
import styles from "./Chat.module.css";

const uidGenerator = new ShortUniqueId({ length: 16 });
let socket: Socket;

const addTabTitleNotification = (count: number) => {
  document.title = `(${count}) Transit Watch`;
};

export interface ChatProps {
  report: ActiveReport;
  userType: "reporter" | "responder";
  announcements?: React.ReactNode; // shown in the chat window
}

export const Chat = ({ report, userType, announcements }: ChatProps) => {
  const [messages, setMessages] = useState<Message[] & { local?: boolean }>([]);
  useEffect(() => {
    setMessages(report.messages);
  }, [report]);
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("ping");
    }, 5000)
  }, [])
  const initializeSocket = async () => {
    await fetch("/api/socket");
    socket = io();
    socket.emit("join", report.id);

    socket.on("newMessage", (message: Message) => {
      console.log("new message", message);
      setMessages((messages) => [...messages, message]);
      if (Notification.permission === "granted") {
        new Notification("New message from Transit Watch", {
          body: message.text,
        });
      }
      if (!document.hasFocus()) addTabTitleNotification(messages.length + 1);
    });
  };
  useEffect(() => {
    initializeSocket();
    return () => {
      socket?.disconnect();
    };
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      Notification.requestPermission();
    }, 2000);
    window.onfocus = () => (document.title = "Transit Watch");
    return () => clearTimeout(timeout);
  }, []);
  // const reportString = formatReport(report, { includeTime: false });
  const [draft, setDraft] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(event.target.value);
  };

  const sendMessage = (message: Message) => {
    socket.timeout(2000).emit("newMessage", message, (err) => {
      // if there's no ack from the server after 2, send the message again
      if (err) sendMessage(message);
    });
  };

  const handleSendMessage = () => {
    if (draft.trim() === "") return;
    const newMessage: Message = {
      id: uidGenerator.randomUUID(),
      from: userType,
      timestamp: new Date(),
      text: draft.trim(),
      reportId: report.id,
    };
    console.log("sending message on socket");
    sendMessage(newMessage);

    setMessages([...messages, newMessage]);
    setDraft("");
  };
  return (
    <div className={styles.chatBox}>
      <div className={styles.messages}>
        <div className="text-white">{announcements}</div>
        {messages.map((message, index) => (
          //@ts-ignore
          <MessageBox
            key={index}
            position={message.from === userType ? "right" : "left"}
            type="text"
            text={message.text}
            date={message.timestamp}
          />
        ))}
      </div>
      <div className={styles.inputField}>
        <textarea
          placeholder="Type a message..."
          rows={2}
          value={draft}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        {/* round button with icon */}
        <button className={styles.sendButton} onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

const reporterDefaultMessages = [
  {
    from: "reporter",
    timestamp: new Date(),
    text: "You can chat here with an operator from Transit Watch when they come online.",
  },
  {
    from: "reporter",
    timestamp: new Date(),
    text: "If you lose internet connection, you can refresh the page to get back to this chat.",
  },
];
