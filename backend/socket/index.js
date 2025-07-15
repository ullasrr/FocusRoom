export default function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });

      socket.on('signal', ({ to, from, signal }) => {
        io.to(to).emit('signal', { from, signal });
      });
    });
  });
}
