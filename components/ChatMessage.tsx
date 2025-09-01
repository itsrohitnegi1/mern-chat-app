
import React from 'react';
import { Message, Role } from '../types';
import { UserIcon, GeminiIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
}

const BlinkingCursor: React.FC = () => {
    return <span className="inline-block w-2 h-5 bg-slate-400 animate-pulse ml-1" />;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
    : 'bg-slate-700 text-slate-200 rounded-r-2xl rounded-tl-2xl';

  return (
    <div className={`${wrapperClasses} w-full`}>
      <div className="flex items-start gap-3 max-w-xl">
        {!isUser && (
          <div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center">
            <GeminiIcon className="w-5 h-5 text-blue-400" />
          </div>
        )}
        <div className={`px-4 py-3 ${bubbleClasses} shadow-md`}>
            <p className="text-base whitespace-pre-wrap leading-relaxed">
                {message.content}
                {isStreaming && <BlinkingCursor />}
            </p>
        </div>
         {isUser && (
          <div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-full flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
