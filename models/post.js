import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    body:{
        type:String,
        require: true
    },

    Img:{
        type: String,
        default:""
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },

    updateAt:{
        type: Date,
        default: Date.now()
    },

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    likedIds: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'user'
    }
});

const post = mongoose.model('post', postSchema);

export default post;