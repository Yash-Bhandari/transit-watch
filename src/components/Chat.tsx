import { useState } from "react";
import { Input, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { FaSend } from 'react-icons/fa';
import { formatReport } from "../lib/utils";
import { ReportingData } from "../types";

interface Message {
  from: "reporter" | "responder";
  timestamp: Date;
  text: string;
}

export interface ChatProps {
  report: ReportingData;
}
export const Chat = ({ report }: ChatProps) => {
  const reportString = formatReport(report, { includeTime: false });
  const [messages, setMessages] = useState<Message[]>([
    { from: "reporter", timestamp: new Date(), text: reportString },
  ]);
  const [draft, setDraft] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleSendMessage = () => {
    if (draft.trim() !== "") {
      const newMessage: Message = {
        from: "reporter",
        timestamp: new Date(),
        text: draft.trim(),
      };

      setMessages([...messages, newMessage]);
      setDraft("");
    }
  };
  return (
    <div>
      {messages.map((message, index) => (
        <MessageBox
          key={index}
          position={message.from === "reporter" ? "right" : "left"}
          type="text"
          text={message.text}
          date={message.timestamp}
        />
      ))}
      <Input placeholder="Type here..." multiline rightButtons={<button><FaSend</button>} />
    </div>
  );
};
