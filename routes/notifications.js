import express, { response } from "express";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
import jwtDecode from "jwt-decode";

import notification from '../models/notification.js'
import post from '../models/post.js'



const app = express.Router();

app.get('/notif/:id', async(req,res)=>{
    const userId = req.params.id;

    const notifList = await notification.find({userId:userId});

    return res.status(200).json(notifList);
})

app.post('/notif/:id', async(req,res) => {

    const postId = req.params.id;
    const currentUser = jwtDecode(req.headers.token).userId;

    const checkPost = await post.findById(postId);


    if(!checkPost){
        throw new Error('Invalid ID');
    }

    const Notif = new notification({
        body: req.body.posting,
        userId: currentUser,
        postId: postId
    })

    Notif.save().then((Notif => {
        return res.status(201).json({
            success: true,
            message:'Berhasil Membuat Notif'
        })
    }))

})

app.post('/read/:id', async(req,res)=>{

    const notifId = req.params.id;

    const checkNotif = await notification.findById(notifId);

    if(!checkNotif){
        return res.status(400).json({message:"Notif tidak ditemukan"})
    }

    const updateNotif = await notification.findOneAndUpdate({_id:notifId},{readFlag:true});

    return res.status(202).json(updateNotif);
})


export default app;