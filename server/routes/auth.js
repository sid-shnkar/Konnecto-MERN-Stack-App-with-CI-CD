import {Router} from 'express'
import { login } from '../controllers/auth.js'


const router = Router()

// Creating an instance of Express Router

router.post("/login",login)

// Setting up a route for handling the POST request to '/login' and assigning the 'login' controller function to handle the request
export default router


// Exporting the router to be used in other files