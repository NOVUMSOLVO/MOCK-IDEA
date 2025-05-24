'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SocketEvents } from '@/types';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
        auth: {
          token: localStorage.getItem('token'),
        },
        transports: ['websocket'],
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        
        // Join user-specific room
        socketInstance.emit('join-room', `user-${user.id}`);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      // Mockup event handlers
      socketInstance.on('mockup-queued', (data: SocketEvents['mockup-queued']) => {
        toast.success('Mockup queued for processing');
      });

      socketInstance.on('mockup-processing', (data: SocketEvents['mockup-processing']) => {
        toast.loading('Generating your mockup...', { id: data.mockupId });
      });

      socketInstance.on('mockup-completed', (data: SocketEvents['mockup-completed']) => {
        toast.success('Mockup generated successfully!', { id: data.mockupId });
        
        // Trigger confetti effect
        if (typeof window !== 'undefined' && window.confetti) {
          window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      });

      socketInstance.on('mockup-failed', (data: SocketEvents['mockup-failed']) => {
        toast.error(`Mockup generation failed: ${data.error}`, { id: data.mockupId });
      });

      socketInstance.on('credit-updated', (data: SocketEvents['credit-updated']) => {
        // This could trigger a context update or refetch
        console.log('Credits updated:', data.creditsRemaining);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [user]);

  const value = {
    socket,
    connected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
