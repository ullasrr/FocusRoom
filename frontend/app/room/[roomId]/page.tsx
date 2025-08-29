'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoCall from './VideoCall';

const RoomPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const [userId, setUserId] = useState<string>('');
  const [roomExists, setRoomExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // One-time userId setup
  useEffect(() => {
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // Room validation
  useEffect(() => {
    const validateRoom = async () => {
      if (!roomId) {
        setError('Invalid room ID');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/room/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          setRoomExists(true);
        } else if (response.status === 404) {
          setRoomExists(false);
          setError('Room not found');
        } else {
          setError('Failed to validate room');
        }
      } catch (error) {
        console.error('Error validating room:', error);
        setError('Network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    validateRoom();
  }, [roomId]);

  // Timeout for loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Request timed out. Please try again.');
      }
    }, 10000); // 10 seconds timeout
    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-lg">Loading room...</p>
        </div>
      </div>
    );
  }

  if (!roomExists || error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Room Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The room you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <VideoCall roomId={roomId} userId={userId} />
    </div>
  );
};

export default RoomPage;