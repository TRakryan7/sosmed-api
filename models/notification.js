import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    body:{
        type:String
    },

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    },

    readFlag:{
        type:Boolean,
        default: false
    },

    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const notification = mongoose.model('notification', notificationSchema);

export default notification;