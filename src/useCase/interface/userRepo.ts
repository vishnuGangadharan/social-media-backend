import { UserTypes } from "../../domain/user";
import  OTP from "../../domain/otp";
import { comments, PostTypes } from "../../domain/post";

interface UserRepo {
    findUserByEmail(email: string): Promise<UserTypes | null>;
    saveOTP(otp:number,email:string,name?:string,phone?:string, password?:string):Promise<any>;
    findOtp(email:string):Promise<OTP | null>;
    deleteOtpByEmail(email:string):Promise<boolean>;
    save(user:UserTypes):Promise<UserTypes>;
    createPost(content:string, userId:string,images:string[],videos:string[],):Promise<PostTypes>;
    postData(): Promise<PostTypes[] | undefined>;
    findById(id:string):Promise<UserTypes | null>;
    createComment(comment: string, userId: string, postId: string, userName:string): Promise<comments>;



}

export default UserRepo;