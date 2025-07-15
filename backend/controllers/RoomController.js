import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';
import User from '../models/User.js';

export const createRoom = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.plan !== 'pro') {
    return res.status(403).json({ error: 'Only Pro users can create rooms' });
  }

  const roomId = uuidv4();
  const room = new Room({ roomId, createdBy: email });
  await room.save();

  res.status(200).json({ roomId });
};

export const getRoom = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.status(200).json(room);
};
