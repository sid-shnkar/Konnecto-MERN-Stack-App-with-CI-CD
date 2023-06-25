import {Router} from 'express'
import {verifyToken} from '../middleware/auth.js'
import { likeComment } from '../controllers/comment.js'

const router = Router()

// Creating an instance of Express Router

router.post('/:commentId/like',verifyToken,likeComment)

// Setting up a route for handling the POST request to '/:commentId/like' and assigning the 'likeComment' controller function to handle the request

export default router

// Exporting the router to be used in other files