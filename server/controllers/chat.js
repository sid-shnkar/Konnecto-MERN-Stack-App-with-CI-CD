import Chat from "../models/Chat.js"

// Importing the Chat model

export const createNewChat = async (req, res) => {
  //console.log("Selected friends - ", req.body.selectedFriends);
    const selectedFriends = JSON.parse(req.body.selectedFriends);

    // Checking if selectedFriends exists
    if(!selectedFriends){
      res.status(404).send({error: "Cannot find user(s) having userId as provided in selectedFriends"});
    }
    
    // Handling single participant chat
    if (Object.keys(selectedFriends).length === 1) {
      try {
        const existingChat = await Chat.findOne({
            createdBy: { $in: [req.user.id, selectedFriends[0]] },
            participants: { $in: [req.user.id, selectedFriends[0]] },
        });
  
        // If the chat already exists, return it
        if (existingChat) {
          res.status(200).json(existingChat);
          return;
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({error: error});
        return;
      }
    }
  
    // Creating a new chat
    const newChat = new Chat({
      participants: selectedFriends,
      createdBy: req.user.id,
    });
  
    try {
      await newChat.save();
      res.status(201).json(newChat);
    } catch (error) {
      console.error(error);
      res.status(500).send({error: error.message});
    }
  };

// fetch all chats for current user
export const getChats = async(req,res) => {
  try{  
  const chats = await Chat.find({$or: [{createdBy: req.user.id}, {participants: req.user.id}]}).populate({path:"participants",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"}).populate({path:"createdBy",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"}).sort({updatedAt:"desc"});
    res.status(200).json(chats);
  }catch(error){
    res.status(500).send({error: error.message});
  }

}

// fetch a single chat by Id
export const getChat = async(req,res) => {
  try{
    const chat = await Chat.findById(req.params.id).populate({path:"participants",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"}).populate({path:"messages",options:{populate:{path:"sender",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"}, sort:{createdAt:"asc"}}}).populate({path:"createdBy",select:"-password -email -friends -viewedProfile -impressions -createdAt -updatedAt -__v"});
    res.status(200).json(chat);
  }catch(error){
    res.status(500).send({error: error.message});
  }
  
}