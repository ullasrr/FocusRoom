'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';

const CreateRoom = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(''); 
    const [joinRoomId, setJoinRoomId] = useState('');
    const router = useRouter();
    


    const createRoom = async ()=>{
        setLoading(true);
        setError('');

        try {
            const userIdFromStorage=localStorage.getItem('userId');
            let userId: string;
            if(!userIdFromStorage){
                userId = uuidv4();
                localStorage.setItem('userId', userId);
            }
            else{
                // userId=userIdFromStorage;
                userId="ullasr2004@gmail.com"; // For testing purposes, using a static email
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email:userId}),
            });
            
            const data=await response.json();

            if (response.ok) {
        router.push(`/room/${data.roomId}`);
      } else {
        setError(data.message || 'Failed to create room');
      }

        } catch (error) {
            setError('Network error occurred');
        }
        finally {
      setLoading(false);
    }
};

    const joinRoom=()=>{
        if(joinRoomId.trim()){
            router.push(`/room/${joinRoomId.trim()}`);
        }
    };

        

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Create Room */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Create Video Call Room</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>

        {/* Join Room */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Join Existing Room</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              onClick={joinRoom}
              disabled={!joinRoomId.trim()}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">How to use:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Create a room and share the Room ID with others</li>
            <li>Or join an existing room using the Room ID</li>
            <li>Allow camera and microphone access when prompted</li>
            <li>Use controls to toggle audio/video or end the call</li>
            <li>Chat with participants using the chat panel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom
