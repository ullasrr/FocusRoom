import { useCallback, useState, useEffect } from 'react';
import type { Socket } from 'socket.io-client';

interface UseWebRTCProps {
  socket: ReturnType<typeof io> | null;
  localStream: MediaStream | null;
  roomId: string;
}

export const useWebRTC = ({ socket, localStream, roomId }: UseWebRTCProps) => {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteUserConnected, setRemoteUserConnected] = useState(false);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setRemoteStream(null);
      }
    };

    return pc;
  }, [socket, roomId]);

  // ... rest of WebRTC logic (createOffer, handleOffer, etc.)

  return {
    peerConnection,
    remoteStream,
    remoteUserConnected,
    setRemoteUserConnected
  };
};
