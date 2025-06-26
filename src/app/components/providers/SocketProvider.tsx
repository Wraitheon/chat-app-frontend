'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io('http://localhost:5005', { withCredentials: true });

    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO connected!');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected!');
      setIsConnected(false);
      setOnlineUsers(new Set());
    });

    socketInstance.on('online_status_response', (onlineUserIds: string[]) => {
      console.log('[SocketProvider] Received online status response:', onlineUserIds);
      setOnlineUsers(new Set([user.id, ...onlineUserIds]));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('online_status_response');
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};