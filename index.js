import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import env from 'dotenv'
import bodyparser from "body-parser"
import cookieparser from 'cookie-parser'

import wordRoute from "./routes/wordRoute.js";
import authRoute from "./routes/authRoute.js"



const app = express();

env.config()

// app.use(cors());
const corsOrigin ={
  // origin:'http://localhost:3000',
  // origin:'https://englishgamehehe.web.app' , //or whatever port your frontend is using
  credentials:true,        
}
app.use(cors(corsOrigin));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser())

app.use("/wordKey", wordRoute);
app.use("/auth", authRoute);

 

const PORT = 4000;    
const URI = process.env.URI_KEY;
mongoose.set("strictQuery", true);
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    app.listen(PORT, () => { 
      console.log("server run");  
    })
  ) 
  .catch((err) => {
    console.log("loi server",err);
  });
