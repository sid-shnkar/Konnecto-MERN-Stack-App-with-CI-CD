import mongoose from 'mongoose'

// Importing the necessary modules

const messageSchema = new mongoose.Schema({
    content:{
       type:String,
       required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"        
    }
},{timestamps:true})

// Defining the messageSchema using the mongoose.Schema class

export const Message = new mongoose.model('Message',messageSchema)

const chatSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
    }],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

// Defining the chatSchema using the mongoose.Schema class

const Chat = new mongoose.model('Chat',chatSchema)

// Creating a model named "Chat" based on the chatSchema and exporting it

export default Chat