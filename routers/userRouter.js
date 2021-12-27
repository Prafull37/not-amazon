import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/userModel.js';
import data from '../data.js';
import expressAsyncHandler from 'express-async-handler';
import { generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.get('/seed',expressAsyncHandler(async (req,res)=>{
    await User.remove({})
    const createdUser = await User.insertMany(data.users);
    res.send({createdUser})
}))

userRouter.post('/signin',expressAsyncHandler(async (req,res)=>{

    const user = await User.findOne({email:req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password,user.password)){
            res.send({
                _id:user._id,
                email:user.email,
                name:user.name,
                isAdmin:user.isAdmin,
                token:generateToken(user)
            })
            return;
        }
    }else{
        res.status(401).send({message:"Invalid User or Message"})
    }

}));


userRouter.post("/register",expressAsyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    const user = new User({name,email,password:bcrypt.hashSync(password,8)});

    const createdUser = await user.save();

    res.send({
        _id:createdUser._id,
        email:createdUser.email,
        name:createdUser.name,
        isAdmin:createdUser.isAdmin,
        token:generateToken(createdUser)
    });
}))

export default userRouter;