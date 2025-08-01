import { validateRoom } from "../controllers/RoomController.js";

export default function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);
    socket.data.roomId=null;
    socket.data.userId=null;

    socket.on('joinRoom',async({roomId,userId})=>{
      try {
        const roomExists = await validateRoom(roomId);
        if (!roomExists) {
          socket.emit('error', { 
            type: 'ROOM_NOT_FOUND',
            message: 'Room does not exist' 
          });
          return;
        }
        
        if(socket.data.roomId){
          socket.leave(socket.data.roomId);
          socket.to(socket.data.roomId).emit('user-disconnected',socket.data.userId);
        }

        socket.data.roomId=roomId;
        socket.data.userId=userId;
        
        // join the room
        socket.join(roomId);
        console.log(`${userId} joined the room ${roomId} `)

        const roomInfo= await io.in(roomId).fetchSockets();
        const connectedUsers=roomInfo.map(socket => socket.data.userId).filter(id => id !== null);

        //notify 
        socket.to(roomId).emit('user-connected',{
          userId,
          connectedUsers : connectedUsers.filter(id => id !== userId),
        })

        socket.emit('room-joined', { 
          roomId, 
          connectedUsers: connectedUsers.filter(id => id !== userId)
        });


      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { 
          type: 'JOIN_ERROR',
          message: 'Failed to join room' 
        });
      }
   });


    //webrtc creating offer

    socket.on('offer',(data)=>{
      const {roomId, offer,targetUserId} = data;

      if(!socket.data.roomId || socket.data.roomId !== roomId){
        socket.emit('error', { 
          type: 'UNAUTHORIZED',
          message: 'Not authorized for this room' 
        });
        return;
      }

      const offerData={
        offer,
        from: socket.data.userId,
        fromSocketId:socket.id
      };

      if (targetUserId) {
        // Send to specific user
        socket.to(roomId).emit('offer', offerData);
      } else {
        // Broadcast to room
        socket.to(roomId).emit('offer', offerData);
      }

      console.log(`Offer sent from ${socket.data.userId} in room ${roomId}`);
    })

    //CREATING ANSWER

    socket.on('answer',(data)=>{
      const {roomId,answer,targetUserId}=data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        socket.emit('error', { 
          type: 'UNAUTHORIZED',
          message: 'Not authorized for this room' 
        });
        return;
      }

      const answerData = {
        answer,
        from: socket.data.userId,
        fromSocketId: socket.id
      };

      if (targetUserId) {
        // Send to specific user
        socket.to(roomId).emit('answer', answerData);
      } else {
        // Broadcast to room
        socket.to(roomId).emit('answer', answerData);
      }

      console.log(`Answer sent from ${socket.data.userId} in room ${roomId}`);
    })

    //ice candidate
    socket.on('ice-candidate',(data)=>{
      const { roomId, candidate, targetUserId } = data;
      
      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        socket.emit('error', { 
          type: 'UNAUTHORIZED',
          message: 'Not authorized for this room' 
        });
        return;
      }

      const candidateData = {
        candidate,
        from: socket.data.userId,
        fromSocketId: socket.id
      };

      if (targetUserId) {
        // Send to specific user
        socket.to(roomId).emit('ice-candidate', candidateData);
      } else {
        // Broadcast to room
        socket.to(roomId).emit('ice-candidate', candidateData);
      }
    })

    //chat message 
    socket.on('chat-message',(data)=>{
      const { roomId, message, timestamp } = data;

      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        socket.emit('error', { 
          type: 'UNAUTHORIZED',
          message: 'Not authorized for this room' 
        });
        return;
      }

      if(!message || typeof message !== 'string' || message.trim().length === 0){
        socket.emit('error', { 
          type: 'INVALID_MESSAGE',
          message: 'Invalid message format' 
        });
        return;
      }

      const sanitizedMessage= message.trim().substring(0, 500); // Limit message length

      const messageData ={
        message: sanitizedMessage,
        from: socket.data.userId,
        fromSocketId: socket.id,
        timestamp: timestamp || new Date().toISOString(),
        roomId
      }      

      // Broadcast to room including sender
      io.to(roomId).emit('chat-message', messageData);
      
      console.log(`Message from ${socket.data.userId} in room ${roomId}: ${sanitizedMessage}`);
    }) 

    // Leave room 

    socket.on('leave-room',()=>{
      const roomId = socket.data?.roomId;
      const userId = socket.data?.userId;
      
      if (roomId && userId) {
        socket.leave(roomId);
        socket.to(roomId).emit('user-disconnected', { 
          userId,
          socketId: socket.id 
        });

      console.log(`${userId} left room ${roomId}`);
      
        socket.data.roomId = null;
        socket.data.userId = null;

      socket.emit('left-room', { roomId });

      }
    })

    socket.on('typing-start',()=>{
      const roomId = socket.data?.roomId;
      const userId = socket.data?.userId;

      if (roomId && userId) {
        socket.to(roomId).emit('user-typing', { 
          userId,
          isTyping: true 
        });
        console.log(`${userId} started typing in room ${roomId}`);
      }

    })

    // typing end
    socket.on('typing-stop', () => {
      const roomId = socket.data?.roomId;
      const userId = socket.data?.userId;
      
      if (roomId && userId) {
        socket.to(roomId).emit('user-typing', { 
          userId,
          isTyping: false 
        });
      }
    });

    // handle media state changes
    socket.on('media-state-change', (data) => {
      const { roomId, mediaState } = data; // mediaState: { audio: boolean, video: boolean }
      
      if (!socket.data.roomId || socket.data.roomId !== roomId) {
        return;
      }

      socket.to(roomId).emit('user-media-state-change', {
        userId: socket.data.userId,
        mediaState
      });
    });

    //disconnect
    socket.on('disconnect',()=>{
      const roomId=socket.data?.roomId;
      const userId=socket.data?.userId;
      if (roomId && userId) {
        socket.to(roomId).emit('user-disconnected', { 
          userId,
          socketId: socket.id,
          timestamp: new Date().toISOString()
        });
        
        console.log(`${userId} disconnected from room ${roomId}`);
      }
      
      console.log('Socket disconnected:', socket.id);
    }) 

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });


  });

  // Handle server-side errors
  io.engine.on('connection_error', (err) => {
    console.error('Connection error:', err);
  });
}
