import express from 'express';
const routes = express.Router();
import UserController from '../../adapters/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../../infrastructure/repository/userRepository';
import OTPGenerator from '../services/otpGenerator';
import EncryptPassword from '../services/bcryptPassword';
import SendOtp from '../services/sendMail';
import jwtService from '../services/generateTocken';
import upload from '../services/multer';
import Cloudinary from '../services/cloudinary';

const JwtService = new jwtService()
const sendOtp = new SendOtp();
const encryptPassword = new EncryptPassword();
const otpGenerator = new OTPGenerator();
const userRepository = new UserRepository();
const cloudinary = new Cloudinary();
const userUseCase = new UserUseCase(userRepository, otpGenerator, encryptPassword, sendOtp, JwtService, cloudinary);
const userController = new UserController(userUseCase);

routes.post('/signup', (req,res,next)=> userController.signup(req,res,next))
routes.post('/verifyOtp',(req,res, next) => userController.verifyOtp(req,res,next))
routes.post('/resendOtp', (req,res,next) => userController.resendOTP(req,res,next))
routes.post('/addPost', upload.fields([{name: 'imagesUpdate', maxCount:3}, {name: 'videosUpdate', maxCount:3}]), 
      (req,res,next) => userController.createPost(req,res,next))
routes.post('/login', (req,res,next) => userController.login(req,res,next))
routes.get('/postData', (req,res,next) => userController.postData(req,res,next))
routes.post('/postComment', (req,res,next) => userController.postComment(req,res,next))
export default routes;