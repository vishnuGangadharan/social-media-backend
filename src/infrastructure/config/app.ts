import express from 'express';
import http from 'http';
import morgon from 'morgan';
import cors from 'cors';
const app = express();
export const httpServer = http.createServer(app);
import userRoutes from '../routes/userRoutes';

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}


app.use(morgon('dev'));
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', userRoutes)