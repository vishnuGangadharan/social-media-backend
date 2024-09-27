import { Document, Schema } from "mongoose";
import { UserTypes } from "./user";

export interface PostTypes {
    content: string;
    userId: Schema.Types.ObjectId;
    image?: string[];
    video?: string[];
    like?: Schema.Types.ObjectId[];
}


export interface comments extends Document {
    comment:string;
    userId: Schema.Types.ObjectId;
    postId : Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    userName: string
}

