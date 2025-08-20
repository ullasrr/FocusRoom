import React from 'react'
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useEffect, useState , useCallback} from 'react';

interface UseSocketProps{
    roomId: string;
    userId: string;
}

export const useSocket =({roomId,userId}:UseSocketProps) => {
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
    const[ isConnected,setIsConnected]=useState(false);
    const [error, setError] = useState<string | null>(null);
    const [connectedUsers, setconnectedUsers] = useState<string[]>([]);

    useEffect(() => {
        const newSocket= io('http://localhost:3001');
        setSocket(newSocket);
        
        newSocket.on('connect',()=>{
            setIsConnected(true);
            newSocket.emit('joinRoom', { roomId, userId });
        })

        newSocket.on('disconnect',()=>{
            setIsConnected(false);
        })

        newSocket.on('connect_error', (error:any) => {
            setError(error.message);
        });

        newSocket.on('room-joined', (data:{userId:string;connectedUsers:string[]}) => {
            setconnectedUsers(data.connectedUsers);
        });

        newSocket.on('user-connected', (data:{userId:string;connectedUsers:string[]}) => {
            setconnectedUsers(data.connectedUsers);
        });
        
        newSocket.on('user-disconnected', (data:{userId:string;connectedUsocketIdsers:string[]}) => {
            setconnectedUsers(prev => prev.filter(id => id !== data.userId));
        });

        return()=>{
            newSocket.close();
        }

     
    }, [roomId,userId])

    const clearError = useCallback(() => setError(null), []);

    return {
    socket,
    isConnected,
    connectedUsers,
    error,
    clearError
  };
}



