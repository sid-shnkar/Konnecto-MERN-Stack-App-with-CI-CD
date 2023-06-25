import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import {createNewChat,getChats,getChat} from "../controllers/chat.js"
const router = Router()

// Creating an instance of Express Router

router.post("/newChat",verifyToken,createNewChat)
router.get("/chats",verifyToken,getChats)
router.get("/:id",verifyToken,getChat)

// Setting up routes for handling different HTTP requests and assigning corresponding controller functions to handle the requests

export default router

// Exporting the router to be used in other files