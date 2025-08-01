import Room from '../models/RoomModel.js';
import User from '../models/userModel.js'; 
import { v4 as uuidv4 } from 'uuid';
import connectToDB from '../config/db.js';

export const createRoom = async(req,res)=>{
  try {
    await connectToDB();
    const {email} = req.body;

    const user=await User.findOne({email});

    if(!user || user.plan!== 'pro'){
      return res.status(403).json({message:'only pro users can create room'});
    }

    const roomId=uuidv4();
    console.log("This is room id ",roomId)
    const room= new Room({roomId,createdBy:email});

    await room.save();

    res.status(200).json({ roomId, message: 'Room created successfully' });
    

  } catch (error) {
    console.log('error in creating room from room controller',error);
    res.status(500).json({error:'server error while creating room'});
  }
}
// checks if room exists or not 
export const getRoom = async (req, res) => {
  try {
    await connectToDB();
    const room = await Room.findOne({roomId:req.params.roomId});
    if(!room){
      return res.status(404).json({error:'Room not found from getroom'});
    }

    // if room exists
    return res.status(200).json({exists:true,room});

  } catch (error) {
    console.log('error in fetching room from getroom',error);
    res.status(500).json({error:'server error while fetching room'});
  }
};


export const validateRoom = async (roomId) => {
  await connectToDB();
  const room = await Room.findOne({roomId});
  return !!room;
}
