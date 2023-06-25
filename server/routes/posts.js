import {Router} from 'express'
import { verifyToken } from '../middleware/auth.js'
import {getFeedPosts,getUserPost,likePost,getComments,postComment} from '../controllers/post.js'

const router = Router()

// Creating an instance of Express Router

router.get('/',verifyToken,getFeedPosts)
router.get('/:userId/posts',verifyToken,getUserPost)
router.patch('/:id/like',verifyToken,likePost)
router.post('/:id/comments',verifyToken,postComment)
router.get('/:id/comments',verifyToken,getComments)

// Setting up routes for handling different HTTP requests and assigning corresponding controller functions to handle the requests

export default router

// Exporting the router to be used in other files