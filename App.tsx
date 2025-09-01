
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role } from './types';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.MODEL,
      content: "Hello! I'm Gemini. How can I assist you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(() => {
    if (process.env.API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly conversational AI. Your responses should be informative and engaging.',
        },
      });
    } else {
        console.error("API_KEY environment variable not set.");
        // Display an error message to the user if the key is missing
        setMessages(prev => [...prev, { role: Role.MODEL, content: "Error: API key is not configured. Please contact the administrator."}])
    }
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
    if (isLoading || !userMessage.trim()) return;
    
    if (!chatRef.current) {
        initializeChat();
    }
    
    if (!chatRef.current) {
      setMessages(prev => [...prev, { role: Role.MODEL, content: "Chat session could not be initialized. Please check your API key."}])
      return;
    }

    setIsLoading(true);

    const userMsg: Message = { role: Role.USER, content: userMessage };
    const modelMsgPlaceholder: Message = { role: Role.MODEL, content: "" };

    setMessages((prevMessages) => [...prevMessages, userMsg, modelMsgPlaceholder]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userMessage });
      
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === Role.MODEL) {
              lastMessage.content = text;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === Role.MODEL) {
            lastMessage.content = errorMessage;
        } else {
            newMessages.push({ role: Role.MODEL, content: errorMessage});
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, initializeChat]);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <ChatHistory messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
