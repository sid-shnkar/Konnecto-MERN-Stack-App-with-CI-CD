import mongoose from "mongoose";

// Importing the necessary modules

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
      default:{}
    },
    comments: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }]
  },
  { timestamps: true }
);

// Defining the postSchema using the mongoose.Schema class

const Post = mongoose.model("Post", postSchema);

// Creating a model named "Post" based on the postSchema and exporting it

export default Post;