import mongoose from "mongoose";

// Importing the necessary modules

const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Post'
    },
    userId:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    likes: {
        type: Map,
        of: Boolean,
        default:{}
    },
},{timestamps:true})

// Defining the commentSchema using the mongoose.Schema class

const Comment = new mongoose.model('Comment',commentSchema)

// Creating a model named "Comment" based on the commentSchema and exporting it

export default Comment