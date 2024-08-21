const jwt=require('jsonwebtoken');
const UserModel=require('../models/user.model')
const auth=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]
    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(401).json({message:"Invalid token try to login again"})
        }
        const user=await UserModel.findById(decoded.id);
        req.user=user;
        next();
    } catch (error) {
        res.status(401).json({message:"Invalid token"})
    }
}
module.exports=auth;