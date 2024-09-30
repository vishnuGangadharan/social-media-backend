import UserRepository from "../infrastructure/repository/userRepository";
import OTPGenerator from "../infrastructure/services/otpGenerator";
import EncryptPassword from "../infrastructure/services/bcryptPassword";
import SendOtp from "../infrastructure/services/sendMail";
import { UserTypes } from "../domain/user";
import jwtService from "../infrastructure/services/generateTocken";
import Cloudinary from "../infrastructure/services/cloudinary";


class UserUseCase {
    private userRepository: UserRepository;
    private otpGenerator: OTPGenerator;
    private encryptPassword: EncryptPassword;
    private sendOtp: SendOtp;
    private jwtService : jwtService;
    private cloudinary: Cloudinary;
    constructor(
        userRepository: UserRepository,
        OTPGenerator : OTPGenerator,
        encryptPassword: EncryptPassword,
        sendOtp: SendOtp,
        jwtService : jwtService,
        cloudinary: Cloudinary
    ) {
        this.userRepository = userRepository;
        this.otpGenerator = OTPGenerator
        this.encryptPassword = encryptPassword;
        this.sendOtp = sendOtp;
        this.jwtService = jwtService;
        this.cloudinary = cloudinary;
    }

    async findUserByEmail(email: string) {
        try {
            const  userExist = await this.userRepository.findUserByEmail(email);
            if(userExist){
                return {
                    status: 400,
                    data:{
                        message: 'User already exist',
                        status: false
                    }
                }
            }else{
                return {
                    status: 200,
                    data:{
                        message: 'User does not exist',
                        status: true
                    }
                }
            }


        } catch (error) {
            throw new Error('Failed to find user');
        }
    }

    async sendOTP(email: string, name: string, phone: string, password: string){
        console.log("1");
        console.log(password);
        
        const otp = this.otpGenerator.createOTP()
        const hashedPassword = await this.encryptPassword.encryptPassword(password);
        console.log('3');
        
        await this.userRepository.saveOTP(otp, email, name, phone, hashedPassword);
        this.sendOtp.sendEmail(email, otp);
        return {
            status: 200,
            data: {
                status: true,
                message: 'verification email send'
            }
        }
        
    }


    async verifyOtp(email: string, otp: number){
        try {
            const findOtp = await this.userRepository.findOtp(email)
            
            if(findOtp?.otp !== otp){
                return {
                    status: 400,
                    data:{
                        message: 'Invalid OTP',
                        status: false
                    }
                }
            }
            
            let data : { name?:string , email?:string, phone?: string, password?: string } ={
                name: findOtp.name,
                email: findOtp?.email,
                phone: findOtp.phone,
                password: findOtp.password
               
            }
            console.log('ddddddd',data);

            let now = new Date().getTime()
            const otpGeneratedAt = findOtp.otpGeneratedAt ? new Date(findOtp.otpGeneratedAt).getTime() : 0
            const otpExpiration = 3 * 60 * 1000;  // 3 minutes in milliseconds     
            if(now - otpGeneratedAt > otpExpiration){
                console.log('otp expired');
                await this.userRepository.deleteOtpByEmail(email)
                return {
                    status: 400,
                    data:{
                        message: 'otp has expired'
                    }
                }
            }   

            await this.userRepository.deleteOtpByEmail(email)

            return {
                status: 200,
                data: {
                    message: 'OTP verified',
                    data:data
                }
            }


        } catch (error) {
            console.log(error);
            
        }
    }



    async verifyOtpUser(user: UserTypes){

        let newUser = { ...user,isVerified: true}
        const userData = await this.userRepository.save(newUser)
        let data = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            isBlocked: userData.isBlocked
        }
        if(userData._id){
        let token =this.jwtService.generateToken(userData._id, 'user')
        
            
        return{
            status: 200,
            data:{
                data:data,
                message: "OTP Verified Successfully",
                token: token,
            }
        }
    }
    }


    async login(email:string, password: string){
        const user = await this.userRepository.findUserByEmail(email);
        if(!user){
            return {
                status: 400,
                data:{
                    message: 'User does not exist',
                    status: false
                }
            }
        }
        if(user.isBlocked){
            return {
                status: 400,
                data:{
                    message: 'User is blocked',
                    status: false
                }
            }
        }
            
        if (user && user.password) {
            const isPasswordValid = await this.encryptPassword.comparePassword(password, user.password);
            console.log(isPasswordValid);
            
            if (!isPasswordValid) {
                return {
                    status: 400,
                    data:{
                        message: 'Invalid password',
                        status: false
                    }
                }
            }
            if(isPasswordValid && user._id){

              let  token = this.jwtService.generateToken(user._id, 'user')
              return {
                status: 200,
                data:{
                    message: 'Login successful',
                    token: token,
                    data:{
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                    }
                }
            }
           
        }

        }
    }
 

    async createPost(content:string , userId: string , imagePath?: string[], videoPath?: string[]){
        if(imagePath && imagePath?.length > 0 ){
            console.log('image use');
            
            const cloundinary  = await this.cloudinary.uploadMultipleImages(imagePath ,'post')
            imagePath = cloundinary
        }
        if(videoPath && videoPath?.length > 0 ){
            console.log('video use');
            
            const cloundinary  = await this.cloudinary.uploadVideo(videoPath ,'post')
            videoPath = cloundinary 
        }
        const post = await this.userRepository.createPost(content, userId, imagePath, videoPath)
        console.log('llll',post);
        
        return {
            status: 200,
            data:{
                message: 'Post added successfully',
                data: post
            }
        }
    }

    async postData(){
        const post = await this.userRepository.postData()
        return {
            status: 200,
            data:{
                message: 'Post fetched',
                data: post
            }
        }
    }


    async addComment(comment: string, postId: string, userId: string) {
        const user = await this.userRepository.findById(userId)
        const userName = user?.name
        const saveComment = await this.userRepository.createComment(comment, userId, postId, userName as string)
        console.log('commetntttt',saveComment);
        
        if (saveComment) {
            return {
                status: 200,
                data: {
                    status: true,
                    data : saveComment,
                    message: "Comment Added Successfully"
                }
            }
        }
    }
    

    async getUserData(userId : string) {
        try {
            const userData = await this.userRepository.getUserData(userId)
                if(userData){
                    return {
                        status:200,
                        data:{
                            data:userData
                        }
                    }
                }
        } catch (error) {
            console.log(error);
            
        }
    }


    async allUsers(userId: string){
        try {
            const allUsers = await this.userRepository.allUsers(userId)
            if(allUsers){
                return {
                    status: 200,
                    data: {
                        data:allUsers
                    }
                }
            }
        } catch (error) {
           console.log(error);
            
        }
    }


   async allVideos(){
    try{

        const reels = await this.userRepository.allVideos()
        if(reels){
            return {
                status:200,
                data:{
                    data:reels
                }
            }
        }
    }catch(error){
        console.log(error);
    }
   }
}

export default UserUseCase;