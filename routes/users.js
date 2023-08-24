import express, { response } from "express";
import bcrypt from 'bcrypt'
import  jwt  from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import dotenv from "dotenv";

import user from '../models/user.js'
import auth from "../helpers/auth.js";
// import { currentUser } from "../helpers/global.js";


const app = express.Router();
dotenv.config({path:'.env'});

app.get('/:id', auth,async(req,res) => {

    
    const listUser = await user.findById(req.params.id)

    if(!listUser){
        return res.status(500).send('Tidak Ada Data');
    }

    return res.status(200).send(listUser);
});

app.get('/profile/:id', auth,async(req,res) =>{
    const profileUser = await user.findById(req.params.id);

    const User = new user({
        name: req.body.name,
        username: req.body.username,
                
    })

});

app.get('/followerCount/:id',auth,async(req,res)=>{
    const userId = req.params.id
    const countFollower = await user.count({followingIds:userId})

    return res.status(200).json(countFollower);
})

app.post('/register', async(req,res)=>{
    
    const userExist = await user.findOne({email:req.body.email.toLowerCase()});
    const secret = process.env.SECRET;

    if(!userExist){
        const User = new user({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email.toLowerCase(),
            hashedPassword: await bcrypt.hash(req.body.password,10)
        })

        User.save().then((User => {
            const token = jwt.sign({
                userId: User.id,
                userEmail: User.email
            },secret,
            {expiresIn:'2h'})


            return res.status(201).send({
                user:User.email,
                // // id: User.id,
                token: token,
                // id:dToken,
                success: true
            })
        }))

    } else {

        return res.status(500).json({
            
            success:false,
            message: "Email sudah terdaftar!",
           
        }) 
    }

    
})


app.post('/login',async(req,res)=>{
    const User = await user.findOne({email:req.body.email/*.toLowerCase()*/});
    const secret = process.env.SECRET;

    if(!User){
        return res.status(400).send('Pengguna Tidak Ditemukan');
    }

    if(User && bcrypt.compareSync(req.body.password,User.hashedPassword)){
        const token = jwt.sign({
            userId: User.id,
            userEmail: User.email
        },secret,
        {expiresIn:'2h'})

        // const dToken = jwtDecode(token).userId;

        return res.status(200).send({
            user:User.email,
            // id: User.id,
            token:  token,
            // id:dToken,
            success: true
        })
    }
    return res.status(401).json({success:false, message:'PASS_INCORECT'})
})

app.post('/update/:id', auth,async(req,res)=>{

    const userId = req.params.id;

    const checkUser = await user.findById(userId);

    if(!checkUser){
        return res.status(404).json({message:'User tidak ditemukan'});
    }

    const User = await user.findOneAndUpdate({_id:userId},{
        name: req.body.name,
        username: req.body.username,
        bio:req.body.bio,
        image:req.body.image,
        coverImage:req.body.coverImage,
        profileImage:req.body.profileImage,
    });

    return res.status(202).json({success:true, message:'Berhasil Update'})
})


app.post('/follow/:id', auth,async(req,res)=>{
    
    const userId = req.params.id;

    const userFollow = await user.findOne({_id:userId});

    if(!userFollow){
        throw new Error('Invalid ID');
    }

    let updateFollowingIds = userFollow.followingIds;

    updateFollowingIds.push(userId)

    const currentUser = jwtDecode(req.headers.token).userId;

    // return res.status(400).json(currentUser)

    const updateUser = await user.findByIdAndUpdate(currentUser, { $push: { followingIds: userId }})
    .then(user=>{

        if(user){
            return res.status(200).json({success:true, message:'Berhasil Follow!'})
        }else{
            return res.status(404).json({success:false, message:'Gagal Follow'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
});



app.delete('/unfollow/:id', auth,async(req,res)=>{
    const userId = req.params.id;

    const userFollow = await user.findOne({_id:userId});

    if(!userFollow){
        throw new Error('Invalid ID');
    }

    let updateFollowingIds = userFollow.followingIds;

    updateFollowingIds.push(userId)

    const currentUser = jwtDecode(req.headers.token).userId;

    const checkFollowed = await user.find({_id:currentUser, followingIds:userId})

    

    if(!checkFollowed){
        return res.status(404).json({success:false, message:'User Belum memfollow'});
    }

    const updateUser = await user.findByIdAndUpdate(currentUser, 
        { $pull: { followingIds: userId 
        
        }}).then(user=>{

        if(user){
            return res.status(200).json({success:true, message:'Berhasil Unfollow!'})
        }else{
            return res.status(404).json({success:false, message:'Gagal Unollow'});
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    });
});




export default app;