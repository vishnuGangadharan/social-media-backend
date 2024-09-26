

interface OTP{
    name?: string;
    email?: string;
    phone?: string;
    otp?: number;
    password?:string;
    otpGeneratedAt?:Date
    otpExpiredAt?:Date
}

export default OTP;