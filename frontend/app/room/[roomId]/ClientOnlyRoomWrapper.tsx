// app/room/[roomId]/ClientOnlyRoomWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const RoomClient = dynamic(() => import('./RoomClient'), { ssr: false });

export default function ClientOnlyRoomWrapper({ roomId }: { roomId: string }) {
  return <RoomClient roomId={roomId} />;
}
