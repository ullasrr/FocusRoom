





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
  const [isChatOpen, setIsChatOpen] = useState(true);
  
  // Custom hooks
  const { socket, isConnected, connectedUsers, error, clearError } = useSocket({ roomId, userId });
  const { localStream, isAudioEnabled, isVideoEnabled, toggleAudio, toggleVideo, stopStream } = useMediaStream();
  const { remoteStream, remoteUserConnected, peerConnection } = useWebRTC({ socket, localStream, roomId });
  const { messages, sendMessage } = useChat({ socket, roomId,userId });

  const handleEndCall = () => {
    stopStream();
    // Additional cleanup logic
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Video Section */}
      <div className="flex-1 flex flex-col">
        <div className="relative">
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
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
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




























































// // components/VideoCall.tsx
// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import io from 'socket.io-client';
// import type { Socket } from 'socket.io-client';
// import { Send, Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageCircle } from 'lucide-react';

// interface Message {
//   message: string;
//   from: string;
//   fromSocketId: string;
//   timestamp: string;
//   roomId: string;
// }

// interface VideoCallProps {
//   roomId: string;
//   userId: string;
// }

// const VideoCall: React.FC<VideoCallProps> = ({ roomId, userId }) => {
//   const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
//   const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isConnected, setIsConnected] = useState(false);
//   const [remoteUserConnected, setRemoteUserConnected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isChatOpen, setIsChatOpen] = useState(true);
//   const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const iceServers = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//     ],
//   };

//   // FIXED: Correct socket URL to match your backend
//   useEffect(() => {
//     console.log('Initializing socket connection...');
//     const newSocket = io('http://localhost:3001'); // FIXED: Changed to port 8000
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       setIsConnected(true);
//       console.log('Connected to server, joining room:', roomId);
//       newSocket.emit('joinRoom', { roomId, userId });
//     });

//     newSocket.on('disconnect', () => {
//       setIsConnected(false);
//       console.log('Disconnected from server');
//     });

//     newSocket.on('connect_error', (error: any) => {
//       console.error('Socket connection error:', error);
//       setError('Failed to connect to server');
//     });

//     return () => {
//       console.log('Cleaning up socket connection');
//       newSocket.close();
//     };
//   }, [roomId, userId]);

//   // Get user media
//   const getUserMedia = useCallback(async () => {
//     try {
//       console.log('Requesting user media...');
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//           facingMode: 'user'
//         },
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true
//         }
//       });
      
//       console.log('Got user media stream:', stream);
//       setLocalStream(stream);
      
//       // Set local video stream
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//         console.log('Set local video srcObject');
//       }
      
//       setIsCallActive(true);
//       return stream;
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//       setError('Failed to access camera/microphone. Please allow permissions.');
//       throw error;
//     }
//   }, []);

//   // Create peer connection
//   const createPeerConnection = useCallback(() => {
//     console.log('Creating peer connection...');
//     const pc = new RTCPeerConnection(iceServers);

//     pc.onicecandidate = (event) => {
//       if (event.candidate && socket) {
//         console.log('Sending ICE candidate');
//         socket.emit('ice-candidate', {
//           roomId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       console.log('Received remote stream:', event.streams[0]);
//       const [stream] = event.streams;
//       setRemoteStream(stream);
      
//       // Set remote video stream
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = stream;
//         console.log('Set remote video srcObject');
//       }
//     };

//     pc.onconnectionstatechange = () => {
//       console.log('Peer connection state:', pc.connectionState);
//       if (pc.connectionState === 'connected') {
//         console.log('Peer connection established successfully');
//       } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
//         console.log('Peer connection failed/disconnected');
//         setRemoteStream(null);
//       }
//     };

//     return pc;
//   }, [socket, roomId]);

//   // Create offer
//   const createOffer = useCallback(async () => {
//     if (!localStream || !socket) {
//       console.log('Cannot create offer: missing local stream or socket');
//       return;
//     }

//     console.log('Creating offer...');
//     const pc = createPeerConnection();
    
//     localStream.getTracks().forEach((track) => {
//       console.log('Adding track to peer connection:', track.kind);
//       pc.addTrack(track, localStream);
//     });

//     setPeerConnection(pc);

//     try {
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
//       console.log('Created offer, sending to remote peer');
      
//       socket.emit('offer', { roomId, offer });
//     } catch (error) {
//       console.error('Error creating offer:', error);
//     }
//   }, [localStream, socket, createPeerConnection, roomId]);

//   // Handle incoming offer
//   const handleOffer = useCallback(async (data: { offer: RTCSessionDescriptionInit; from: string; fromSocketId: string }) => {
//     console.log('Received offer from:', data.from);
    
//     try {
//       let stream = localStream;
//       if (!stream) {
//         stream = await getUserMedia();
//       }

//       const pc = createPeerConnection();
      
//       stream.getTracks().forEach((track) => {
//         console.log('Adding track for answer:', track.kind);
//         pc.addTrack(track, stream!);
//       });

//       setPeerConnection(pc);
//       await pc.setRemoteDescription(data.offer);
      
//       const answer = await pc.createAnswer();
//       await pc.setLocalDescription(answer);
//       console.log('Created answer, sending to remote peer');

//       if (socket) {
//         socket.emit('answer', { roomId, answer });
//       }
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   }, [localStream, getUserMedia, createPeerConnection, socket, roomId]);

//   // Handle incoming answer
//   const handleAnswer = useCallback(async (data: { answer: RTCSessionDescriptionInit; from: string; fromSocketId: string }) => {
//     console.log('Received answer from:', data.from);
//     if (peerConnection) {
//       try {
//         await peerConnection.setRemoteDescription(data.answer);
//         console.log('Set remote description from answer');
//       } catch (error) {
//         console.error('Error handling answer:', error);
//       }
//     }
//   }, [peerConnection]);

//   // Handle ICE candidate
//   const handleIceCandidate = useCallback(async (data: { candidate: RTCIceCandidateInit; from: string; fromSocketId: string }) => {
//     console.log('Received ICE candidate from:', data.from);
//     if (peerConnection && peerConnection.remoteDescription) {
//       try {
//         await peerConnection.addIceCandidate(data.candidate);
//         console.log('Added ICE candidate');
//       } catch (error) {
//         console.error('Error adding ICE candidate:', error);
//       }
//     }
//   }, [peerConnection]);

//   // FIXED: Socket event listeners to match your backend exactly
//   useEffect(() => {
//     if (!socket) return;

//     // Handle successful room join - MATCHES your backend
//     const handleRoomJoined = (data: { roomId: string; connectedUsers: string[] }) => {
//       console.log('Successfully joined room:', data);
//       setConnectedUsers(data.connectedUsers);
//       if (data.connectedUsers.length > 0) {
//         setRemoteUserConnected(true);
//       }
//     };

//     // Handle user connected - MATCHES your backend event name 'user-connected'
//     const handleUserConnected = (data: { userId: string; connectedUsers: string[] }) => {
//       console.log('User connected:', data);
//       setConnectedUsers(data.connectedUsers);
//       setRemoteUserConnected(true);
      
//       // Create offer for new user if we have local stream
//       if (localStream) {
//         setTimeout(() => createOffer(), 1000); // Small delay to ensure both sides are ready
//       }
//     };

//     // Handle user disconnected - MATCHES your backend
//     const handleUserDisconnected = (data: { userId: string; socketId: string; timestamp?: string }) => {
//       console.log('User disconnected:', data);
//       setRemoteUserConnected(false);
//       setRemoteStream(null);
//       setConnectedUsers(prev => prev.filter(id => id !== data.userId));
      
//       if (peerConnection) {
//         peerConnection.close();
//         setPeerConnection(null);
//       }
//     };

//     // Handle chat messages - MATCHES your backend structure
//     const handleChatMessage = (message: Message) => {
//       console.log('Received chat message:', message);
//       setMessages(prev => [...prev, message]);
//     };

//     // Handle errors - MATCHES your backend error structure
//     const handleError = (error: { type: string; message: string }) => {
//       console.error('Socket error:', error);
//       setError(error.message);
//     };

//     // FIXED: Use exact event names from your backend
//     socket.on('room-joined', handleRoomJoined);
//     socket.on('user-connected', handleUserConnected); // FIXED: hyphen not space
//     socket.on('user-disconnected', handleUserDisconnected);
//     socket.on('offer', handleOffer);
//     socket.on('answer', handleAnswer);
//     socket.on('ice-candidate', handleIceCandidate);
//     socket.on('chat-message', handleChatMessage);
//     socket.on('error', handleError);

//     return () => {
//       socket.off('room-joined', handleRoomJoined);
//       socket.off('user-connected', handleUserConnected);
//       socket.off('user-disconnected', handleUserDisconnected);
//       socket.off('offer', handleOffer);
//       socket.off('answer', handleAnswer);
//       socket.off('ice-candidate', handleIceCandidate);
//       socket.off('chat-message', handleChatMessage);
//       socket.off('error', handleError);
//     };
//   }, [socket, handleOffer, handleAnswer, handleIceCandidate, localStream, createOffer, peerConnection]);

//   // Auto-start camera when connected
//   useEffect(() => {
//     if (isConnected && !localStream) {
//       getUserMedia();
//     }
//   }, [isConnected, localStream, getUserMedia]);

//   // Toggle audio
//   const toggleAudio = useCallback(() => {
//     if (localStream) {
//       const audioTrack = localStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioEnabled(audioTrack.enabled);
//       }
//     }
//   }, [localStream]);

//   // Toggle video
//   const toggleVideo = useCallback(() => {
//     if (localStream) {
//       const videoTrack = localStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoEnabled(videoTrack.enabled);
//       }
//     }
//   }, [localStream]);

//   // End call
//   const endCall = useCallback(() => {
//     console.log('Ending call...');
    
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//       setLocalStream(null);
//     }
    
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }
    
//     setRemoteStream(null);
//     setIsCallActive(false);
//     setRemoteUserConnected(false);
    
//     if (socket) {
//       socket.emit('leave-room');
//     }
//   }, [localStream, peerConnection, socket]);

//   // Send message
//   const sendMessage = useCallback(() => {
//     if (newMessage.trim() && socket) {
//       const messageData = {
//         roomId,
//         message: newMessage,
//         timestamp: new Date().toISOString(),
//       };
      
//       socket.emit('chat-message', messageData);
//       setNewMessage('');
//     }
//   }, [newMessage, socket, roomId]);

//   // Auto-scroll messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       {/* Video Section */}
//       <div className="flex-1 flex flex-col">
//         <div className="flex-1 relative bg-black">
//           {/* Error Message */}
//           {error && (
//             <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-10">
//               {error}
//               <button onClick={() => setError(null)} className="ml-2 text-white">×</button>
//             </div>
//           )}

//           {/* Remote Video */}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//             style={{ display: remoteStream ? 'block' : 'none' }}
//           />
          
//           {/* Waiting Message */}
//           {!remoteStream && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">🎥</div>
//                 <p className="text-gray-400 text-lg">
//                   {!isConnected 
//                     ? 'Connecting to server...' 
//                     : !localStream 
//                     ? 'Starting camera...' 
//                     : remoteUserConnected 
//                     ? 'Connecting video...' 
//                     : 'Waiting for someone to join...'}
//                 </p>
//                 <p className="text-gray-500 text-sm mt-2">Room: {roomId}</p>
//               </div>
//             </div>
//           )}
          
//           {/* Local Video (Picture-in-Picture) */}
//           <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500">
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
//               You
//             </div>
//           </div>

//           {/* Connection Status */}
//           <div className="absolute top-4 left-4">
//             <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
//               isConnected ? 'bg-green-600' : 'bg-red-600'
//             }`}>
//               <div className="w-2 h-2 bg-white rounded-full"></div>
//               <span className="text-sm">
//                 {isConnected ? `Connected (${connectedUsers.length + 1}/2)` : 'Disconnected'}
//               </span>
//             </div>
//           </div>

//           {/* Debug Info */}
//           <div className="absolute top-16 left-4 bg-gray-800 bg-opacity-75 rounded p-2 text-xs">
//             <div>Socket: {isConnected ? '✓' : '✗'}</div>
//             <div>Local Stream: {localStream ? '✓' : '✗'}</div>
//             <div>Remote User: {remoteUserConnected ? '✓' : '✗'}</div>
//             <div>Remote Stream: {remoteStream ? '✓' : '✗'}</div>
//             <div>Peer Connection: {peerConnection ? '✓' : '✗'}</div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="flex justify-center items-center space-x-4 p-6 bg-gray-800">
//           <button
//             onClick={toggleAudio}
//             className={`p-3 rounded-full transition-colors ${
//               isAudioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
//             }`}
//           >
//             {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
//           </button>

//           <button
//             onClick={toggleVideo}
//             className={`p-3 rounded-full transition-colors ${
//               isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
//             }`}
//           >
//             {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
//           </button>

//           <button
//             onClick={endCall}
//             className="p-4 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
//           >
//             <PhoneOff size={24} />
//           </button>

//           <button
//             onClick={() => setIsChatOpen(!isChatOpen)}
//             className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
//           >
//             <MessageCircle size={24} />
//           </button>
//         </div>
//       </div>

//       {/* Chat Section */}
//       {isChatOpen && (
//         <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
//           <div className="p-4 border-b border-gray-700">
//             <h3 className="text-lg font-semibold">Chat</h3>
//             <p className="text-sm text-gray-400">Room: {roomId}</p>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {messages.length === 0 && (
//               <div className="text-center text-gray-400 text-sm">
//                 No messages yet. Start the conversation!
//               </div>
//             )}
            
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`p-3 rounded-lg ${
//                   msg.from === userId ? 'bg-blue-600 ml-8' : 'bg-gray-700 mr-8'
//                 }`}
//               >
//                 <p className="text-sm">{msg.message}</p>
//                 <div className="flex justify-between items-center mt-1 text-xs text-gray-300">
//                   <span>{msg.from === userId ? 'You' : msg.from}</span>
//                   <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
//                 </div>
//               </div>
//             ))}
            
//             <div ref={messagesEndRef} />
//           </div>

//           <div className="p-4 border-t border-gray-700">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                 placeholder="Type a message..."
//                 className="flex-1 p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 maxLength={500}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim()}
//                 className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoCall;