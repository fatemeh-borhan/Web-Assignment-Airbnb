const express = require('express')
const router = express.Router();

const Room= require("../models/Room");
//hanoz madoule nasakhtim vase in bayad besazi bad ino require koni


router.get("/roomListing",(req,res)=>{

     res.render("Room/roomListing");   
     });

     // router.get("/add",hasAccess,(req,res)=>
     // {
     //     res.render("Room/roomCreate")
     // });
 router.get("/add",(req,res)=>
{
    res.render("Room/roomCreate")
});
//router.post("/add",hasAccess,(req,res)=>
router.post("/add",(req,res)=>
{
     const errors=[];
     if(req.body.title =="")
     {
         errors.push("please enter  a Title for Room")
     }

     if(req.body.price =="")
     {
         errors.push("please enter  a Price for Room")
     }

     if(req.body.description =="")
     {
         errors.push("please enter  a Description for Room")
     }

     if(req.body.location =="")
     {
         errors.push("please enter  a Location for Room")
     }

     if(req.files == null){
          errors.push("Sorry you must upload a photo of room")
         }
     
               //file is not an image
     if(req.files!==null && req.files.profilePic.mimetype.indexOf("image")==-1)
          {
              errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
          }
         
     if(errors.length > 0 )
     {
         res.render("Room/roomCreate",{
             message:errors
         })
     }
 
     else
     {
    const newRoom=
    {
        title:req.body.title,
        price:req.body.price,
        description : req.body.description,
        location:req.body.location,
        dateReminder:req.body.reminderDate
    }
        const task = new Task(newTask)
        task.save()
        .then(()=>{
            console.log(`Task was added to the database`);
            console.log(`${task}`);
            res.redirect("/task/list");
        
        })
        .catch(err=>console.log(`Error : ${err}`));
  
}
});
module.exports=router;