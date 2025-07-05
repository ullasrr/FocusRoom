// import express from 'express';
// import {Router} from "express";
// const router = Router();
// const User= import('../models/userModel.js');

// router.post('/',async(req,res)=>{
//     const {email,name,image,provider,plan} = req.body;

//     try{
//         let user= await User.create({email,name,image,provider,plan});
//         if(!user){
//             user=await User.create({email,name,image,provider,plan});

//         }
//         res.status(200).json(user);
//     }
//     catch(e){
//         console.log(e);
//     }

// })

// export default router;