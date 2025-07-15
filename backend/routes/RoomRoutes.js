import express from 'express';
import { createRoom, getRoom } from '../controllers/RoomController';

const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomId', getRoom);

export default router;
