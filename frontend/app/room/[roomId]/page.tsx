// app/room/[roomId]/page.tsx

export const dynamic = 'force-dynamic'; // ✅ Required to safely access params in SSR

import { getServerSession } from 'next-auth';
import ClientOnlyRoomWrapper from './ClientOnlyRoomWrapper';

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;
  return <ClientOnlyRoomWrapper roomId={roomId} />;
}
