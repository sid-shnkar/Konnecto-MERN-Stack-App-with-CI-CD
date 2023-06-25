import User from "../models/User.js"

// Importing the necessary models

export const getUser = async(req,res) => {
    try {       
        const {id} = req.params

        // Finding the user by ID using User.findById
        const user = await User.findById(id)
        delete user.password    
        
        // Sending the user data as a JSON response
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({error:err.message})
    }    
}

export const getUserFriends = async(req,res) => {
    try {
        const {id} = req.params

        // Finding the user by ID using User.findById
        const user = await User.findById(id)      
        
        // Fetching the friends of the user
        const friends = await Promise.all(user.friends.map(id=>User.findById(id)))

        // Formatting the friend data to include only necessary fields
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{
            return {_id,firstName,lastName,occupation,location,picturePath}
        })

        // Sending the formatted friend data as a JSON response
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const addRemoveFriend = async(req,res) => {    
    try {
        if(req.user.id!==req.params.id){
            return res.status(403).json("Not authorized")
        } 
        const {id,friendId} = req.params  
        
        // Finding the user and friend by their respective IDs
        const user = await User.findById(id)
        const friend = await User.findById(friendId)  
        
        // Updating the friends list based on whether the friend is already in the list or not
        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=>id!==friendId)
            friend.friends = friend.friends.filter((id)=>id!==id)
        }else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }        

        // Saving the updated user and friend documents
        await user.save()   
        await friend.save() 
        
        // Fetching the updated friends list
        const friends = await Promise.all(user.friends.map(id=>User.findById(id)))

        // Formatting the friend data to include only necessary fields
        const formattedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath})=>{return {
            _id,firstName,lastName,occupation,location,picturePath
        }})

        // Sending the updated formatted friend data as a JSON response
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}