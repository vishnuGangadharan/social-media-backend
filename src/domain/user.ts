import { PostTypes } from "./post";


export interface UserTypes{
    _id?:string;
    name?:string;
    email?:string;
    phone?:string;
    password?:string;
    profilePicture?:string;
    isVerified?:boolean
    isBlocked?:boolean;
    isAdmin?:boolean;
    isGoogle?:boolean;
    lastSeen?:Date;
}

export interface profilePost{
    user: UserTypes | null;
    post:PostTypes[]
}