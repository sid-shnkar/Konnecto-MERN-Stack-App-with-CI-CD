import Chat,{Message} from "./models/Chat.js";

// Importing required modules and models

let activeUsers = [];

// Array to store active user IDs

const handleSocket = (socket,io)=>{
    console.log("client connected to server:",socket.user);
    console.log("connected",io.engine.clientsCount);

    // When a client is connected to the server, log the user and the number of connected clients

    if(!activeUsers.includes(socket.user.id)){
        activeUsers.push(socket.user.id);
    }

    // Add the user ID to the activeUsers array if it's not already present

    console.log(activeUsers);

     // Log the updated activeUsers array

    socket.on("userLogged",()=>{
        socket.join("activeUsers");
        socket.emit("activeUsers",activeUsers);
    })

    // When the "userLogged" event is emitted, the client joins the "activeUsers" room and receives the activeUsers array

    socket.on("listenActiveUsers",()=>{
        socket.join("activeUsers");
        socket.to("activeUsers").emit("activeUsers",activeUsers);
    })

    // When the "listenActiveUsers" event is emitted, the client joins the "activeUsers" room and sends the activeUsers array to all other clients in the room

    const handleStartChat = (chatId) => {
        socket.join(chatId);
        console.log('joined to room:',chatId);
    }

    // Function to handle joining a chat room
    const chatListener = async(data,callback)=>{
        console.log(data);
        const {msg,chatId} = data;
        const message = new Message({content:msg,sender:socket.user.id,chatId:chatId});
        await message.save();
        await Chat.findOneAndUpdate({_id: chatId}, {$push: {messages: message}});
        const newMessage = await Message.findById(message._id).populate({path:"sender",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"})
        callback(newMessage) 
        socket.broadcast.emit("notifications",1);               
        socket.to(chatId).emit("chat",newMessage);
    }
   
    // Function to handle incoming chat messages

    socket.on("startChat",handleStartChat);
    socket.on("chat",chatListener);
    socket.on("leaveRoom",(chatId)=>{
        console.log("leaved room:",chatId);
        socket.leave(chatId);
    })  

    // Event listeners for "startChat", "chat", and "leaveRoom" events

    socket.on("disconnect",()=>{
        activeUsers = activeUsers.filter(user=>user!==socket.user.id);
        socket.to("activeUsers").emit("activeUsers",activeUsers);
        socket.leave("activeUsers");
        socket.disconnect();
        console.log(activeUsers);
        console.log("disconnected",io.engine.clientsCount);
    })  

    // When the client disconnects, remove the user ID from the activeUsers array, emit the updated array to clients in the "activeUsers" room, leave the room, and disconnect the socket
 
}

export default handleSocket;