import { Request, Response, NextFunction } from 'express';
import UserUseCase from '../useCase/userUseCase';
import { UserTypes } from '../domain/user';
interface MulterFiles {
    post: Express.Multer.File[];
}




class UserController {
    private userUseCase: UserUseCase;
    constructor(
        userUseCase: UserUseCase
    ) {
        this.userUseCase = userUseCase;
    }

    async signup(req : Request, res: Response, next: NextFunction) {
       try{
        
       const {name, email, phone, password, confirmPassword , isGoogle} = req.body;
       const alreadyExist = await this.userUseCase.findUserByEmail(email);
       if(alreadyExist?.data.status == true && req.body.isGoogle == true){
        // const user = await this.userUseCase.verifyOtpUser(req.body)
        console.log('google auth');
        
       }

       if(alreadyExist.data.status ==true){
        const sendOTP = await this.userUseCase.sendOTP(email,name,phone,password)
        return res.status(sendOTP.status).json(sendOTP.data)
       }else{
        return res.status(alreadyExist.status).json(alreadyExist.data)
       }
       }catch(error){
        next(error);
       }
        
    }


    async verifyOtp(req: Request, res: Response, next: NextFunction){
        try{            
            const {email,otp} = req.body;
            const verify = await this.userUseCase.verifyOtp(email,otp)            
            if (verify?.status == 400) {
                return res.status(verify.status).json(verify.data);
            }else if(verify?.status == 200){
                let saveUser = await this.userUseCase.verifyOtpUser(verify.data.data as UserTypes)
                return res.status(saveUser?.status ?? 200).json(saveUser?.data)
            }
        }catch(error){
            next(error);
        }
    }


    async resendOTP(req: Request, res: Response, next: NextFunction){
        try {
            console.log('mmmmmmmmmm',req.body);
            const {name, email, phone, password} = req.body.userData
            const resend = await this.userUseCase.sendOTP(email,name,phone,password )
            return res.status(resend.status).json(resend.data)
            
        } catch (error) {
            next(error)
            
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            const {email, password} = req.body;
            console.log('login',req.body);
            
            const login = await this.userUseCase.login(email, password)
            console.log('login',login);
            if(login){
                return res.status(login.status).json(login.data)
            }
        } catch (error) {
            next(error)
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction){
        try {
           const { content, userId } = req.body;
           console.log('req',req.files);
           
           if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
            const video = (req.files as { [fieldname: string]: Express.Multer.File[] })?.videosUpdate;
            const image = (req.files as { [fieldname: string]: Express.Multer.File[] })?.imagesUpdate; 
            let videoPath: string[] = [];
            let imagePath: string[] = [];
            if(video){
                videoPath = video.map((file) => file.path);
                console.log('video',videoPath);
                
            }
            if(image){
                imagePath = image.map((file) => file.path);
                console.log('image',imagePath);
                
            }
            const response =await this.userUseCase.createPost(content, userId, imagePath, videoPath);
            return res.status(response.status).json(response.data)
         
        }
            
        } catch (error) {
            next(error)
        }
    }


    async postData(req: Request, res: Response, next: NextFunction){
        try {
            
            const post = await this.userUseCase.postData()
            return res.status(post.status).json(post.data)
        } catch (error) {
            next(error)
        }
    }


    async postComment(req: Request, res: Response, next: NextFunction) {
        try{
        const { comment, postId, userId } = req.body.data;
        console.log('comment',req.body);
        
        const saveComment = await this.userUseCase.addComment(comment, postId, userId);
        if (saveComment) {
            return res.status(saveComment.status).json(saveComment.data)
        }
        }catch(error){
            next(error)
        }

    }


    async getUserData(req: Request, res:Response, next: NextFunction){
        try {
            let userId = req.query.userId
          const response = await this.userUseCase.getUserData(userId as string)
          if(response)
         return res.status(response?.status).json(response.data)
        } catch (error) {
            next(error)
        }
        
    }

}

export default UserController