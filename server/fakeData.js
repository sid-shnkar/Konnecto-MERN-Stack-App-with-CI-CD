import mongoose from "mongoose"
import User from "./models/User.js"
import Post from "./models/Post.js"
import { faker } from '@faker-js/faker';


/* Mongoose Setup */ 
const createFakeData = () => {
    mongoose.connect(process.env.MONGO_URL,{
    dbName:"mern-social",
    useNewUrlParser:true,
    useUnifiedTopology:true
    })
    .then(async()=>{
        
        /* Uncomment this for creating fake users and posts */ 
        const users = []
        const avatarFileNames= ['pp1.jpg','pp2.jpg','pp3.jpg','pp4.jpg','pp5.jpg','pp6.jpg','pp7.jpg','pp8.jpg','pp9.jpg','pp10.jpg']
        for(let i = 0; i<20 ; i++){
            const firstName = faker.name.firstName()
            const lastName = faker.name.lastName()
            const email = faker.internet.email(firstName,lastName)
            const picturePath = faker.helpers.arrayElement(avatarFileNames)
            const password = faker.internet.password()
            const location = faker.address.city()
            const occupation = faker.name.jobTitle()
            const viewedProfile = faker.datatype.number({min:10,max:4000})
            const impressions = faker.datatype.number({min:10,max:4000})
            const user = {firstName,lastName,email,password,picturePath,location,occupation,viewedProfile,impressions}
            users.push(user)
        }
        await User.create(users)
        const userData = await User.find()
        const userIds = userData.map(user=>user._id)    
        const posts = []
        const postFileNames= ['post1.jpg','post2.jpg','post3.jpg','post4.jpg','post5.jpg','post6.jpg','post7.jpg','post8.jpg','post9.jpg','post10.jpg']
        for(let i=0;i<100; i++){
            const userId = faker.helpers.arrayElement(userIds)
            const user = await User.findOne({_id:userId}).select(['firstName','lastName','location','picturePath'])
            const firstName = user.firstName
            const lastName = user.lastName
            const location = user.location
            const description = faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 }))
            const picturePath = faker.helpers.arrayElement(postFileNames)
            const userPicturePath = user.picturePath
            const post = {userId,firstName,lastName,location,description,picturePath,userPicturePath}    
            posts.push(post)   
        }    
        await Post.create(posts)    
    
    
    })
    .catch(error=>console.log(error))
}

export default createFakeData