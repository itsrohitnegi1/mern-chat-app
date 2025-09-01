
import React, { useEffect, useRef } from 'react';
import { Message, Role } from '../types';
import ChatMessage from './ChatMessage';

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isStreaming={
              isLoading &&
              index === messages.length - 1 &&
              msg.role === Role.MODEL
            }
          />
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </main>
  );
};

export default ChatHistory;
