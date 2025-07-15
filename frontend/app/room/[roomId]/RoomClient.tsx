'use client';
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!);

export default function RoomClient({ roomId }: { roomId: string }) {
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (myVideo.current) myVideo.current.srcObject = stream;

      socket.emit('join-room', { roomId, userId: socket.id });

      socket.on('user-connected', (userId) => {
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        peer.on('signal', (signal) => {
          socket.emit('signal', { to: userId, from: socket.id, signal });
        });

        peer.on('stream', (remoteStream) => {
          if (peerVideo.current) peerVideo.current.srcObject = remoteStream;
        });

        peerRef.current = peer;
      });

      socket.on('signal', ({ from, signal }) => {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
        });

        peer.on('signal', (answerSignal) => {
          socket.emit('signal', { to: from, from: socket.id, signal: answerSignal });
        });

        peer.on('stream', (remoteStream) => {
          if (peerVideo.current) peerVideo.current.srcObject = remoteStream;
        });

        peer.signal(signal);
        peerRef.current = peer;
      });
    });
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <video ref={myVideo} autoPlay playsInline muted className="w-64 border" />
      <video ref={peerVideo} autoPlay playsInline className="w-64 border" />
    </div>
  );
}
