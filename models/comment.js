import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    body:{
        type:String
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    updateAt:{
        type: Date,
        default: Date.now()
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post'
    }
});

const comment = mongoose.model('comment',commentSchema);

export default comment;