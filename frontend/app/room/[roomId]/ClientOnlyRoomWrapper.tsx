'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RoomClient = dynamic(() => import('./RoomClient'), { ssr: false });

export default function ClientOnlyRoomWrapper({ roomId }: { roomId: string }) {
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function validate() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        console.log("SESSION from crow", session);

        if (!session || session?.user?.plan !== 'pro') {
          setError('❌ Only Pro users can access rooms.');
          return;
        }
        console.log("Room ID:", roomId);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/${roomId}`);
        const data = await res.json();

        if (res.status === 404 || !data?.roomId) {
          const createRes= await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room`,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: session.user.email })
          });



          const newroom=await createRes.json();

          if(newroom?.roomId){
            router.push(`/room/${newroom.roomId}`)
           return; 
          }
          setError('❌ could not create the room.');

          return;
        }

      } catch (err) {
        setError('⚠️ Something went wrong.');
      }
      
    }

    validate();
  }, [roomId,router]);

if (error) return <p className="text-red-500 p-4">{error}</p>;


  return <RoomClient roomId={roomId} />;
}
