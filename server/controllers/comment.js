import Comment from '../models/Comment.js'

// Importing the Comment model

export const likeComment = async(req,res) => {    
    try {
        const {commentId} = req.params

        // Finding the comment by ID using Comment.findById
        const comment = await Comment.findById(commentId)

        // Updating the likes based on whether the user has already liked the comment or not
        if(comment.likes.get(req.user.id)){
            comment.likes.delete(req.user.id)
        }else{
            comment.likes.set(req.user.id,true)
        }

        // Saving the updated comment document
        await comment.save()

        // Sending a success message as a JSON response
        res.status(201).json("success")
    } catch (error) {
        res.status(404).json({error:error.message})
    }
    
}