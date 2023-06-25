import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'

// Importing necessary models

export const createPost = async(req,res) => {
    if (req.user.id!==req.body.userId){
        return res.status(403).json("you are not authorized")
    }
    try {
        const {userId,picturePath,description} = req.body

        // Finding the user by ID using User.findById
        const user = await User.findById(userId)
        let filename = ""
        if (req.file){
            filename = req.file.filename
        }

        // Creating a new Post instance with the provided data
        const newPost = new Post({
        userId:userId,
        firstName:user.firstName,
        lastName:user.lastName,
        location:user.location,
        userPicturePath:user.picturePath,
        description:description,
        picturePath:filename
        })

        // Saving the new post to the database
        await newPost.save()

        // Fetching all posts in descending order of creation time
        const posts = await Post.find().sort({createdAt:'desc'})

        // Sending the updated posts list as a JSON response
        res.status(201).json(posts)        
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const getFeedPosts = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const startIndex = (page - 1) * limit;

        // Fetching posts with pagination support
        const posts = await Post.find()
                    .sort({ createdAt: "desc" })
                    .skip(startIndex)
                    .limit(limit);
        
        // Counting the total number of posts
        const totalPosts = await Post.countDocuments()
       
        // Sending the posts and totalPosts count as a JSON response
        res.status(200).json({posts: posts, totalPosts:totalPosts});

    } catch (error) {
        res.status(404).json({error:error.message})
    }

}

export const getUserPost = async(req,res) => {
    try {
        const {userId} = req.params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const startIndex = (page - 1) * limit;

        // Fetching posts of a specific user with pagination support
        const posts = await Post.find({userId:userId})
                                .sort({createdAt:"desc"})
                                .skip(startIndex)
                                .limit(limit);

        // Counting the total number of posts by the user
        const totalPosts = await Post.countDocuments({userId:userId})

        // Sending the user's posts and totalPosts count as a JSON response
        res.status(200).json({posts:posts,totalPosts:totalPosts})
    } catch (error) {
        res.status(404).json({error:error.message})
    }

}

export const likePost = async(req,res) => {
    try {
        const {id} = req.params  
        
        // Finding the post by ID using Post.findById
        const post = await Post.findById(id)

        // Updating the likes based on whether the user has already liked the post or not
        if(post.likes.get(req.user.id)){
            post.likes.delete(req.user.id)
        }else{
            post.likes.set(req.user.id,true)
        }

        // Saving the updated post document
        await post.save()

        // Sending the updated post as a JSON response
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({error:error.message})        
    }
    
}

export const getComments = async(req,res) => {
    try {
        const {id} = req.params
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 7
        const startIndex = (page - 1) * limit 

        // Finding the post by ID and selecting only the 'comments' field using Post.findById
        const comments = await Post.findById(id).select({comments:1,_id:0}).populate({
            path: "comments",
            options: { sort: { createdAt: "desc" },skip:startIndex,limit:limit },
          })

        // Counting the total number of comments for the post
        const totalComments = await Post.findById(id)

        // Sending the comments and totalComments count as a JSON response
        res.status(200).json({comments:comments,totalComments:totalComments.comments.length})
    } catch (error) {
        res.status(404).json({error:error.message})
    } 
}

export const postComment = async(req,res) => {
    try {
        const {id} = req.params;
        const {text} = req.body;

        // Finding the post by ID using Post.findById
        const post = await Post.findById(id);
        //console.log("POST FETCHED - ", post);
        if(!post){
            //res.status(404).json({error: "Unable to find post with that Id"});
            throw new Error("Unable to find post with that Id");
        }

        // Creating a new Comment instance with the provided data
        const newComment = new Comment({
            postId: id,
            userId: req.user.id,
            text: text
        })

        // Adding the newComment to the 'comments' array of the post
        await Post.findByIdAndUpdate(
            id,
            { $push: { comments: newComment } },
            { new: true }
        )

        // Saving the new comment
        await newComment.save()

        // Sending the new comment as a JSON response
        res.status(201).json(newComment)
    } catch (error) {
        res.status(404).json({error:error.message})
    }

}