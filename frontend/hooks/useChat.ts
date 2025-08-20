import { useState, useCallback, useEffect } from 'react';
import type { Socket } from 'socket.io-client';

interface Message {
  message: string;
  from: string;
  fromSocketId: string;
  timestamp: string;
  roomId: string;
}

interface UseChatProps {
  socket: ReturnType<typeof io> | null;
  roomId: string;
  userId: string;
}

export const useChat = ({ socket, roomId, userId }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Listen for incoming chat messages
  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('chat-message', handleChatMessage);

    return () => {
      socket.off('chat-message', handleChatMessage);
    };
  }, [socket]);

  // Function to send a message
  const sendMessage = useCallback(
    (messageText: string) => {
      if (!socket || !messageText.trim()) return;

      const messageData = {
        roomId,
        message: messageText,
        from: userId,
        fromSocketId: socket.id,
        timestamp: new Date().toISOString(),
      };

      socket.emit('chat-message', messageData);
      setMessages((prev) => [...prev, messageData]);
    },
    [socket, roomId, userId]
  );

  return {
    messages,
    sendMessage,
  };
};
