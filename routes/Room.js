const express = require('express')
const router = express.Router();
const Room= require("../models/Room");
const Book= require("../models/Booking");
const hasAccess= require("../middleWare/auth");
const isAdmin= require("../middleWare/userCheck");
const path = require("path");


 router.get("/add",hasAccess,isAdmin,(req,res)=>
{
    res.render("Room/roomCreate")
});

router.post("/add",hasAccess,isAdmin,(req,res)=>
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
     
        if(errors.length > 0 )
        {
            res.render("Room/roomCreate",{
               message:errors
           })
        }    //file is not an image

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
    const errors=[];
       if(req.files == null){
        errors.push("Sorry you must upload a photo of room")
       }
       if(req.files!==null && req.files.roomImage.mimetype.indexOf("image")==-1)
      {
        errors.push("Sorry you can only upload images : Example (jpg,gif, png) ")
      }
    
    if(errors.length > 0 )
    {
        res.render("Room/roomCreate",{
           message:errors,
           title : newRoom.title,
           price : newRoom.price,
           description : newRoom.description,
           location : newRoom.location

       })
    }
    else{
        const room = new Room(newRoom);
       
        room.save()
        
        .then(room=>{
            console.log(`Room was added to the database`);
            console.log(`${room}`); 
            
             //rename file to include the userid
             req.files.roomImage.name = `db_${room._id}${path.parse(req.files.roomImage.name).ext}`
             console.log(`Room was added to the database`);
             console.log(`${room}`);
             //upload file to server
             req.files.roomImage.mv(`public/uploads/${req.files.roomImage.name}`)
             .then(()=>{
 
                 //Then is needed to refer to associate the uploaded image to the user
                 Room.findByIdAndUpdate(room._id,{
                    roomImage:req.files.roomImage.name 
                 })
                 .then(()=>{
                    console.log(`File name was updated in the database`)
                   
                    res.redirect("/room/list");
                   // res.redirect("/user/login"); 
                 })
           
                 .catch(err=>console.log(`Error :${err}`));
        });
    })
        .catch(err=>console.log(`Error : ${err}`));
}
}
});

///**********************LIst************************* */
router.get("/list",hasAccess,isAdmin,(req,res)=>
{
    Room.find()
    .then((room)=>{
        res.render("Room/roomView",
        {
            roomLists:room
        });
    })
    .catch(err=>console.log(`Error : ${err}`));
});
///********roomListing */
router.get("/roomListing",(req,res)=>{
    Room.find()
    .then((room)=>{
        res.render("Room/roomListing",  
        {
            roomLists:room
        });
    })
    .catch(err=>console.log(`Error : ${err}`))
    
    });
//******Profile */
router.get("/profile/:id",hasAccess,isAdmin,(req,res)=>{

    Room.findById(req.params.id)
    .then((room)=>{
        res.render("Room/roomProfile",{
            roomDocument:room
        })
    })
    .catch(err=>console.log(`Error : ${err}`));
})
//*****EDit */
router.get("/edit/:id",hasAccess,isAdmin,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        res.render("Room/roomEditForm",{
            roomDocument:room
        })

    })
    .catch(err=>console.log(`Error : ${err}`));
});
//Search *******
// router.get("/search",(req,res)=>{

//         res.render("/Room/home");
//     });

router.post("/search",(req,res)=>
{
    const errors=[];
    if(req.body.location =="")
    {
        errors.push("please enter  a location")
    }
    if(errors.length > 0 )
    {
        res.render("/",{
            message:errors
        })
    }
    else
    {
    Room.find({location:req.body.location})

    .then((room)=>{
        console.log(`${req.body.location}`);
        console.log(`${room}`);
        res.render("Room/roomSearch",{
            roomSearch:room
        })



    })
    .catch(err=>console.log(`Error : ${err}`));
}
});
//Booking*******************

// router.get("/room/book/:id",hasAccess,(req,res)=>
// {const newRoom=
//     {
//        user:req.session.userInfo._id,
        //room:req.body.room._id,
        //dateBooked:req.body.dateBooked
//     }

//     const book = new BOOK(newRoom)
//     book.save()
//     .then(book=>{
//         console.log(`booking in done`);
//         console.log(`${book}`);
//     }
//     .then(()=>{
//     Book.findById(req.params.id)
//     .then((book)=>{

//         res.render("Room/roomEditForm",{
//             roomDocument:room
//         })

//     })
//     .catch(err=>console.log(`Error : ${err}`));
// }
// });

//    
//************ */
//Edit *******

router.put("/edit/:id",hasAccess,isAdmin,(req,res)=>
{
    Room.findById(req.params.id)
    .then((room)=>{

        room.title=req.body.title;
        room.price=req.body.price;
        room.description=req.body.description;
        room.location=req.body.location;
        room.dateReminder=req.body.dateReminder;

        room.save()

        .then(()=>{
           res.redirect("/room/list") 
        })
        .catch(err=>console.log(`Error : ${err}`));

    })
    .catch(err=>console.log(`Error : ${err}`));
});

module.exports=router;
