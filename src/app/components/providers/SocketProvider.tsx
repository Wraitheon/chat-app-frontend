'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

// Define the shape of the data and functions our context will provide.
interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

// Create the context. This is what components will "consume".
const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

// Create a custom hook for easy access to the context.
// Instead of `useContext(SocketContext)` everywhere, we'll just use `useSocket()`.
export const useSocket = () => {
  return useContext(SocketContext);
};

// This is the Provider component that will manage the socket lifecycle.
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // When the provider mounts, we create the socket connection.
    // The URL points to the future custom server we'll create.
    const socketInstance = io('http://localhost:5005', { // Or whatever port your backend is on
      // 2. Add withCredentials: true to send the auth cookie. THIS IS CRUCIAL.
      withCredentials: true,
    });

    // Set up listeners for built-in Socket.IO events.
    socketInstance.on('connect', () => {
      console.log('🔌 Socket.IO connected!');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected!');
      setIsConnected(false);
    });

    // Store the socket instance in our state.
    setSocket(socketInstance);

    // This is the CRUCIAL cleanup function.
    // When the component unmounts, we disconnect the socket to prevent memory leaks.
    return () => {
      socketInstance.disconnect();
    };
  }, []); // The empty dependency array means this effect runs only ONCE.

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};