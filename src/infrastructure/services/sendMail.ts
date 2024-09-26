import nodemailer from 'nodemailer';
import NodeMailer from '../../useCase/interface/nodeMailer';
import dotenv from 'dotenv';
dotenv.config();


class SendOtp implements NodeMailer {
    private transporter: nodemailer.Transporter  
    
    constructor(){

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:'cozastore4@gmail.com',
                pass:process.env.PASS
            }
        })
    }

    sendEmail(email: string, otp: number): void {
        console.log('otpLLL',otp);
        console.log('emailLLL',email);
        const mailOPtions : nodemailer.SendMailOptions ={
            from:process.env.USER,
            to:email,
            subject:"OneTouch Verification Code",
            text:`${email}, your verification code is: ${otp}`

        }
        this.transporter.sendMail(mailOPtions, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('verification code sent successfully')
            }
        })
    }

}   


export default SendOtp