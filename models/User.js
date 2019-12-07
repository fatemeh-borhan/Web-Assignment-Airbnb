const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

    const registerschema = new Schema({
        email: 
        {
            type: String,
            required:true,
            unique:true
        },

        FirstName: 
        {
            type:String,
            required:true
        },
        LastName:
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
        }, 
        type :
        {
             type:String,
             default:"User"
        }, 
        dateCreated :
        {
             type:Date,
             default: Date.now()
        }

    }); 

    //The "pre" mongoose function is going to call the below function right before the document is saved to the DB
    registerschema.pre("save",function(next){
  
        bcrypt.genSalt(10)

       
        .then(salt=>{
            console.log("Was called")
            bcrypt.hash(this.password,salt)
            .then(hash=>{
                 console.log(`Current :${this.password}`);
                 console.log(`Hash :${hash}`);
                this.password=hash
                // The below code is a call back function that does the following :
                 //It forces the code of execution to  move onto the next code in the execution queue 
                next();
            })
        })

})

    //This creates a Model called Forms. This model represents our Collection in our database
    const Forms = mongoose.model('Forms', registerschema);
    module.exports=Forms;
 