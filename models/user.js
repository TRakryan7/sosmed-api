import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    // id:{
    //     type: String,
        
    // }, 
    name:{
        type: String,
        default:''
    },

    username:{
        type: String,
        default:''
    },

    bio:{
        type: String,
        default:''
    },

    email:{
        type: String,
        unique: true
    },

    emailVerified:{
        type: Date,
        default:''
    },

    image:{
        type: String,
        work: mongoose.SchemaTypes.Url,
        profile: mongoose.SchemaTypes.Url,
        default: ''
    },

    coverImage:{
        type: String,
        work: mongoose.SchemaTypes.Url,
        profile: mongoose.SchemaTypes.Url,
        default: ''
    },

    profileImage:{
        type: String,
        work: mongoose.SchemaTypes.Url,
        profile: mongoose.SchemaTypes.Url,
        default: ''
    },

    hashedPassword:{
        type: String,
        default:''
    },

    createdAt:{
        type: Date,
        default: Date.now()
    },
    updateAt:{
        type: Date,
        default: Date.now()
    },
    followingIds:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'user',
    },
    hasNotification:{
        type: Boolean,
    },
});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
})


userSchema.set('toJSON',{
    virtual:true,
})

const user = mongoose.model('user',userSchema);

export default user;
