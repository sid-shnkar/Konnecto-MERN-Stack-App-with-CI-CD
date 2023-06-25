import jwt from 'jsonwebtoken'

// Importing the necessary library

export const verifySocketToken = (socket,next) => {
    try {       
        let token = socket.handshake.query.token
        if (!token) return next(new Error("Authentication error: Token is missing."));  
        
        // Verifying the token using jwt.verify function
        const verified = jwt.verify(token,process.env.JWT_SECRET)   
        
        // Adding the verified user data to the socket object
        socket.user=verified     
        next()        
    } catch (err) {
        next(new Error("Authentication error: Invalid token."));
    }
}