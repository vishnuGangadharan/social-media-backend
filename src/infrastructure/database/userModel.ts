import mongoose, { Schema, Model, Document} from "mongoose";
import { UserTypes } from "../../domain/user";

type UserDocument = UserTypes & Document;

const userSchema: Schema< UserDocument> = new Schema< UserDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
        default: "https://www.w3schools.com/w3images/avatar2.png"
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isBlocked:{
        type: Boolean,
        required: true,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    isGoogle: {
        type: Boolean,
        required: true,
        default: false,
    },
    lastSeen:{
        type: Date,
        default: null,
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }]
},{ timestamps: true})

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;