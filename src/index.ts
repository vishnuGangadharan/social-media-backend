import { httpServer } from "./infrastructure/config/app";
import connectToDb from "./infrastructure/config/connectDB";

const port = process.env.PORT || 3008;

const startServer  = async(): Promise< void> =>{
  await connectToDb();
  const app = httpServer;
  app.listen(port,() => {
    console.log(`server is running on port ${port}`);
    
  })
}

startServer();