import express, { response } from "express";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import dotenv from "dotenv";

import post from "../models/post.js";
import user from '../models/user.js'
import comment from "../models/comment.js";
// import { currentUser } from "../helpers/global.js";
//posts/64ae480817f9b3217290f9f0

import auth from "../helpers/auth.js";


const app = express.Router();
dotenv.config({ path: '.env' });

app.get('/', auth, async (req, res) => {
    const listPosts = await post.find().populate('userId').sort({createdAt:'desc'}).exec()
    //  .then(post => {
            return res.status(200).json(listPosts); 
    // }). catch(err=>{
    //         return res.status(404).json({success: false, error:err})
    //  })
    
    // try {  
    
    //     return res.status(200).json(listPosts); 
    // } catch (err) {
    //     console.log(err);
    // }

    
})

app.get('/:id', auth,async(req,res)=>{
    const listPosts = await post.findById(req.params.id)

    return res.status(200).json(listPosts);
});

app.get('/posts/:id', auth, async (req, res) => {
    const userId = req.params.id
    const listPosts = await post.find({ userId: userId })

    return res.status(200).json(listPosts);
});


app.get('/postFollower/:id', auth,async(req,res)=>{
    const usersId = await user.findById(req.params.id);

    const listPosts = await post.find({userId: usersId.followingIds}).sort({createdAt:'desc'})

    return res.status(200).json({listPosts});
});



app.post('/:id', auth,async(req,res)=>{
    
    const userId = req.params.id;

    const Post = new post({
        body: req.body.posting,
        img: req.body.img,
        userId: userId
    })

    Post.save().then((User => {
        return res.status(201).json({
            success: true,
            message:'Berhasil Membuat Post Baru'
        })
    }))


});

app.post('/like/:id', auth,async(req,res)=>{
    
    const postId = req.params.id;
    const currentUser = jwtDecode(req.headers.token).userId;

    const postLike = await post.findOne({_id:postId});

    if(!postLike){
        throw new Error('Invalid ID');
    }

    let updateLiked = postLike.likedIds;

    updateLiked.push(currentUser)

    // return res.status(400).json(currentUser)

    const updatePost = await post.findByIdAndUpdate(postId, { $push: { likedIds: currentUser }})
        .then(post=>{

            if(post){
                return res.status(200).json({success:true, message:'Berhasil menyukai'})
            }else{
                return res.status(404).json({success:false, message:'Gagal menyukai'});
            }
        })
        .catch(err=>{
            return res.status(400).json({success: false, error: err})
    })
});



app.delete('/unlike/:id', auth,async(req,res)=>{
    const postId = req.params.id;

    const currentUser = jwtDecode(req.headers.token).userId;

    const postLiked = await post.findOne({_id:postId});

    if(!postLiked){
        throw new Error('Invalid ID');
    }

    let updateLikedIds = postLiked.likedIds;

    updateLikedIds.push(currentUser)

    const checkPost = await post.find({_id:postId, likedIds: currentUser})

    

    if(!checkPost){
        return res.status(404).json({success:false, message:'User Belum memfollow'});
    }

    const updateUser = await post.findByIdAndUpdate(postId, 
        { $pull: { likedIds: currentUser
        
        }}).then(post=>{

        if(post){
            return res.status(200).json({success:true, message:'Berhasil Unfollow!'})
        }else{
            return res.status(404).json({success:false, message:'Gagal Unollow'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    });
});





export default app;