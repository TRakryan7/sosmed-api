import mongoose from "mongoose";

const chatsSchema = mongoose.Schema({
    body:{
        type:String
    },

    chatHomeId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'chatHome'
    },    

    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    
    readFlag:{
        type: Boolean
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const chats = mongoose.model('chats',chatsSchema);

export default chats;