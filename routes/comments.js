import express, { response } from "express";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { ObjectId } from "mongodb";


import post from "../models/post.js";
import user from '../models/user.js'
import comment from "../models/comment.js";
import mongoose from "mongoose";
// import { currentUser } from "../helpers/global.js";


const app = express.Router();


app.get('/commets/:id', async(req,res)=>{
    const postId = req.params.id;

    const getComments = await comment.find({postId:postId}).sort({createdAt:'desc'});

    return res.status(200).json(getComments);
});

app.get('/limit/:id', async (req, res) => {
    
    
    
    const gedtPostId = req.params.id ;

    const comments = await comment.find({ postId: new mongoose.Types.ObjectId(gedtPostId) })
                                  .populate({ path: 'userId' })
                                  .limit(2);

    return res.status(200).json(comments);
})


app.post('/comment/:id', async(req,res)=>{

    const postId = req.params.id;
    // const currentUser = jwtDecode(req.headers.token).userId;

    const checkPost = await post.findById(postId);

    // console.log('ini dirunning')

    if(!checkPost){
        throw new Error('Invalid ID');
    }
 
    const Comment = new comment({
        body: req.body.posting,
        userId: req.body.userId,
        postId: postId
    })

    Comment.save().then((User => {
        return res.status(201).json({
            success: true,
            message:'Berhasil Komentar'
        })
    }))

})



export default app;