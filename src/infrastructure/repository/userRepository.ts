import OTP from "../../domain/otp";
import { comments, PostTypes } from "../../domain/post";
import { profilePost, UserTypes } from "../../domain/user";
import UserRepo from "../../useCase/interface/userRepo";
import commentModel from "../database/commentModel";
import OTPModel from "../database/otpModel";
import PostModel from "../database/postModel";
import UserModel from "../database/userModel";

class UserRepository implements UserRepo {

    async findUserByEmail(email: string): Promise<UserTypes | null> {

        const exist = await UserModel.findOne({ email });

        return exist
    }

    async saveOTP(otp: number, email: string, name?: string, phone?: string, password?: string): Promise<any> {
        const otpDoc = new OTPModel({
            email,
            name,
            phone,
            password,
            otp,
            otpGeneratedAt: new Date(),
            otpExpiredAt: new Date(Date.now() + 1000 * 60 * 3)
        })

        const saveDoc = await otpDoc.save()
        return saveDoc;
    }

    async findOtp(email: string): Promise<OTP | null> {
        const updating = await OTPModel.deleteMany({
            otpExpiredAt: { $lt: new Date() }
        });

        const otp = await OTPModel.findOne({ email });

        return otp;
    }

    async deleteOtpByEmail(email: string): Promise<boolean> {
        const findAndDelete = await OTPModel.deleteOne({ email })
        return findAndDelete ? true : false
    }

    async save(user: UserTypes): Promise<UserTypes> {
        const newUser = new UserModel(user)
        const savedUser = await newUser.save();
        return savedUser;
    }

    async createPost(content: string, userId: string, images?: string[], videos?: string[]): Promise<PostTypes> {
        console.log('images,,,,', images);

        const newPOst = new PostModel({
            content,
            userId,
            image: images || [],
            video: videos || [],
        })

        const savedPost = await newPOst.save();
        return savedPost;
    }

    async postData(): Promise<PostTypes[] | undefined> {
        try {
            const postData = await PostModel.find()
                .populate({ path: 'userId', select: '_id name phone email like' }).exec();
            return postData;
        } catch (error) {
            console.log('error', error);

        }
    }

    async findById(id: string): Promise<UserTypes | null> {
        const userData = await UserModel.findById(id).exec()
        return userData
    }


    async createComment(comment: string, userId: string, postId: string, userName: string): Promise<comments> {
        const newComment = new commentModel({
            comment,
            userId,
            postId,
            userName,
        });
        const savedComment = await newComment.save();
        return savedComment.toObject();
    }

    async getUserData(userId: string): Promise<profilePost | undefined> {

        try {
            const user = await UserModel.findById(userId).select('-password')

            const post = await PostModel.find({ userId: userId })
            let data = {
                user,
                post
            }
            return data
        } catch (error) {
            console.log(error);

        }
    }

}

export default UserRepository;