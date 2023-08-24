import mongoose from "mongoose";

const chatHomeSchema = mongoose.Schema({

    userIdFrom: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    userIdTo: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const chatHome = mongoose.model('chatHome',chatHomeSchema);

export default chatHome;