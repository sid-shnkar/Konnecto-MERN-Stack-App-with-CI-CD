import {config} from 'dotenv' /* Loads .env file contents into process.env. */
import express from 'express' /* Creates an Express application */
import morgan from 'morgan' /* HTTP request logger middleware for node.js */
import helmet from 'helmet' /* Helmet helps you secure your Express apps by setting various HTTP headers */
import bodyParser from 'body-parser' /* Parse incoming request bodies in a middleware before your handlers, available under the req.body property. */
import cors from 'cors' /* Enable Cors */ 
import mongoose from 'mongoose' /* Mongo odm */
import multer from 'multer' /* Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency. */
import path from 'path' /* The path module provides utilities for working with file and directory paths. */
import { fileURLToPath } from 'url' /* This function ensures the correct decodings of percent-encoded characters as well as ensuring a cross-platform valid absolute path string. */
import {register} from "./controllers/auth.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/posts.js"
import verifyTokenRoute from "./routes/verifyToken.js"
import commentRoutes from "./routes/comment.js"
import chatRoutes from "./routes/chat.js"
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controllers/post.js'
import http from 'http'
import {Server} from 'socket.io'
import { verifySocketToken } from './middleware/authSocket.js'
import handleSocket from './socket.js'
import createFakeData from './fakeData.js'



/*Configurations*/
const __filename = fileURLToPath(import.meta.url) 
const __dirname = path.dirname(__filename) /* dirname created again because when using type `module`, __dirname can't be used as usually */
config()
const app = express()
app.use(express.json())
app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}}))
// app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,"public/assets")))

/* File Storage */
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets")
    },
    filename:function (req,file,cb){
        cb(null, Date.now() + '-' + file.originalname)
    },  
})
const upload = multer({storage})

/* Routes with file uploads */
app.post("/auth/register",upload.single("picturePath"),register)
app.post("/posts",verifyToken,upload.single("picturePath"),createPost)

/* Routes without file uploads */
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)
app.use("/verifyToken",verifyTokenRoute)
app.use("/comments",commentRoutes)
app.use("/chat",chatRoutes)


/* Mongoose Setup */ 
const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL,{
    dbName:"mern-social",
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(async()=>{
    
    /* Uncomment this for creating fake users and posts */ 
    //createFakeData()
   
    /* socket config */
    const server = http.createServer(app)
    const io = new Server(server,{cors:{origin:'*'}})
    io.use(verifySocketToken).on("connect",(socket) => handleSocket(socket,io))    
    /* */
    
    server.listen(PORT,()=>console.log(`Server Port:${PORT}`))
})
.catch(error=>console.log(error))