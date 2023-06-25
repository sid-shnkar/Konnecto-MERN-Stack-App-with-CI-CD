import bcrypt from 'bcrypt' /* A library to help you hash passwords. */
import jwt from 'jsonwebtoken' /* An implementation of JSON Web Tokens. */
import User from '../models/User.js'

/* Register User */
export const register = async(req,res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body
        let filename = ""
        if(req.file){
            filename = req.file.filename
        }
        
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password,salt)

        const newUser = new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:passwordHash,
            picturePath:filename,
            friends:friends,
            location:location,
            occupation:occupation,
            viewedProfile:Math.floor(Math.random()*1000),
            impressions:Math.floor(Math.random()*1000)
        })

        const savedUser = await newUser.save()
        const savedUserObject = savedUser.toJSON()
        delete savedUserObject.password
        res.status(201).json(savedUserObject)

    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

/* Login User */
export const login = async(req,res) => {
    try {
        const {email,password} = req.body      

        const user = await User.findOne({email:email})
        if(!user) return res.status(400).json({msg:"User does not exist."})

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({msg:"Invalid credentials"})

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        const userObject = user.toJSON()
        delete userObject.password
        res.status(200).json({token,user:userObject})

    } catch (err) {
        res.status(500).json({error:err.message})
    }
}