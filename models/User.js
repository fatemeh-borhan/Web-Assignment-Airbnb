const mongoose = require('mongoose');

const Schema = mongoose.Schema;
    const registerSchema = new Schema({
        email: 
        {
            type: String,
            required:true
        },

        FirstName: 
        {
            type:String,
            required:true
        },
        LaststName:
        {   type:String,
            required:true
        },

        password:{
            type:String,
            required:true
        },
        Month:{
            type:String,
            required:true
        },
        Day:{
            type:Number,
            required:true
        },
        Year:{
            type:Number,
            required:true
        }  
    }); 

    //This creates a Model called Forms. This model represents our Collection in our database
    const Forms = mongoose.model('Forms', registerSchema);
    module.exports=Forms;