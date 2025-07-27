import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

export const createRoom = async (req, res) => {
  try {
    await connectDB();

    const {email}= req.body;
    const user = await User.findOne({ email });

    if (!user || user.plan !== 'pro') {
    return res.status(403).json({ error: 'Only Pro users can create rooms' });
  }
  const roomId = uuidv4();
  const room = new Room({ roomId, createdBy: email });
  await room.save();

  res.status(200).json({ roomId });


  } catch (error) {
      console.error('❌ Error creating room:', error);
      res.status(500).json({ error: 'Server error while creating room' });
  }


};

export const getRoom = async (req, res) => {
  try {
    await connectDB(); // ✅ ensure DB is connected

    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    res.status(200).json({ exists: true, room });
  } catch (error) {
    console.error('❌ Error fetching room:', error);
    res.status(500).json({ error: 'Server error while fetching room' });
  }
};