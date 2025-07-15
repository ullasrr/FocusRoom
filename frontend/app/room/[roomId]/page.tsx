// ✅ server component
import ClientOnlyRoomWrapper from './ClientOnlyRoomWrapper';

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return <ClientOnlyRoomWrapper roomId={params.roomId} />;
}
