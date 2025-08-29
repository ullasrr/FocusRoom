'use client';
import React, { useState } from 'react';
import VideoDisplay from './VideoDisplay';
import ControlBar from '../../../components/ControlBar';
import ChatPanel from '../../../components/ChatPanel';
import { ConnectionStatus, ErrorDisplay, DebugInfo } from '../../../components/StatusComponents';
import { useSocket } from '../../../hooks/useSocket';
import { useMediaStream } from '../../../hooks/useMediaStream';
import { useWebRTC } from '../../../hooks/useWebRTC';
import { useChat } from '../../../hooks/useChat';

interface VideoCallProps {
  roomId: string;
  userId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userId }) => {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);

  // Custom hooks
  const { socket, isConnected, connectedUsers, error, clearError } = useSocket({ roomId, userId });
  const { localStream, isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, stopStream } = useMediaStream();
  const { remoteStream, remoteUserConnected, peerConnection } = useWebRTC({ socket, localStream, roomId });
  const { messages, sendMessage } = useChat({ socket, roomId, userId });

  const handleEndCall = () => {
    stopStream();
    if (peerConnection) {
      peerConnection.close();
    }
    if (socket) {
      socket.disconnect();
    }
    // Optionally redirect to home
    // router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Video Section */}
      <div className="flex-1 flex flex-col">
        <div className="relative flex-1">
          <VideoDisplay
            localStream={localStream}
            remoteStream={remoteStream}
            isConnected={isConnected}
            remoteUserConnected={remoteUserConnected}
            roomId={roomId}
            userId={userId}
          />
          <ErrorDisplay error={error} onClearError={clearError} />
          <ConnectionStatus isConnected={isConnected} userCount={connectedUsers.length + 1} />
          <DebugInfo
            isConnected={isConnected}
            localStream={localStream}
            remoteUserConnected={remoteUserConnected}
            remoteStream={remoteStream}
            peerConnection={peerConnection}
          />
        </div>

        <ControlBar
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onEndCall={handleEndCall}
          onToggleChat={() => setIsChatOpen((prev) => !prev)}
        />
      </div>

      {/* Chat Section */}
      {isChatOpen && (
        <ChatPanel
          socket={socket}
          messages={messages}
          roomId={roomId}
          userId={userId}
          onSendMessage={sendMessage}
        />
      )}
    </div>
  );
};

export default VideoCall;