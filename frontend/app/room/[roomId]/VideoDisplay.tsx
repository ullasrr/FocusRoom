import React, { useRef, useEffect } from 'react';

interface VideoDisplayProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  remoteUserConnected: boolean;
  roomId: string;
  userId: string;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
  localStream,
  remoteStream,
  isConnected,
  remoteUserConnected,
  roomId,
  userId
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const getWaitingMessage = () => {
    if (!isConnected) return 'Connecting to server...';
    if (!localStream) return 'Starting camera...';
    if (remoteUserConnected) return 'Connecting video...';
    return 'Waiting for someone to join...';
  };

  return (
    <div className="flex-1 relative bg-black">
      {/* Remote Video */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ display: remoteStream ? 'block' : 'none' }}
      />
      
      {/* Waiting Message */}
      {!remoteStream && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎥</div>
            <p className="text-gray-400 text-lg">{getWaitingMessage()}</p>
            <p className="text-gray-500 text-sm mt-2">Room: {roomId}</p>
          </div>
        </div>
      )}
      
      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          You
        </div>
      </div>
    </div>
  );
};

export default VideoDisplay;
