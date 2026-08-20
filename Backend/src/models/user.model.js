import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
     username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
    },
    email:{
        type:String,
        unique:[true,'email is already registered'],
        required:true
    },
    password:{
        
    }

})