const express=require('express');
const bcrypt=require('bcrypt');
const { hash } = require('bcryptjs');
const jwt=require('jsonwebtoken')
const UserModel = require('../models/user.model');
const userRouter=express.Router();


userRouter.post('/register',async(req,res)=>{
  const {username,password,role}=req.body;
  try {
    bcrypt.hash(password,5,async(err,hash)=>{
      if(err){
        return res.status(500).json({message:"Error occured during hashing password"})
      }
      const user=new UserModel({
        username,
        password:hash,
        role
      })
      await user.save();
      res.status(201).json({message:"User registered successfully"})
    })
  } catch (error) {
    res.status(500).json({message:"Error occured during creation of user"})
  }
})

userRouter.post('/login',async(req,res)=>{
  const {username,password}=req.body;
  try {
    const user=await UserModel.findOne({username});
    if(!user){
      return res.status(400).json({message:"User not found"})
    }
    if(user){
      bcrypt.compare(password,user.password,(err,result)=>{
        if(err){
          return res.status(401).json({message:`Internal server error${err}`})
        }
        if(result){
          const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY)
          res.status(200).json({message:"User logged in successfully",token})
        }
      })
    }
  } catch (error) {
    res.status(400).json({message:"wrong password"})
  }
})

module.exports=userRouter;