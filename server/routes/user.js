import {Router} from 'express'
import { verifyToken } from '../middleware/auth.js'
import {getUser,getUserFriends,addRemoveFriend} from '../controllers/user.js'

const router = Router()

// Creating an instance of Express Router

router.get('/:id',verifyToken,getUser)
router.get('/:id/friends',verifyToken,getUserFriends)
router.patch('/:id/:friendId',verifyToken,addRemoveFriend)

// Setting up routes for handling different HTTP requests and assigning corresponding controller functions to handle the requests

export default router

// Exporting the router to be used in other files