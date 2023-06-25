import jwt from 'jsonwebtoken'

// Importing the necessary library

export const verifyToken = async(req,res,next) => {
    try {       
        let token = req.headers.authorization
        
        if (!token) return res.status(403).send("Access Denied")

        // Checking if the token starts with "Bearer " and extracting the token value
        if(token.startsWith("Bearer ")){
            token = token.slice(7,token.length).trimLeft()
        }

        
        // Verifying the token using jwt.verify function
        const verified = jwt.verify(token,process.env.JWT_SECRET)

        // Adding the verified user data to the request object
        req.user=verified        
        next()        
    } catch (err) {
        res.status(401).json({error:err.message})
    }
}