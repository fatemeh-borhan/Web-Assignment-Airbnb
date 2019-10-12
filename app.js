const express= require("express");
const exphbs  = require('express-handlebars');

const app=express();
const PORT=process.env.PORT || 3000;
//const PORT=3000;

app.use(express.static('public'))


//This tells Express that I want to use handlebars as my TEMPLATING ENGINE!!!!!!!!!!
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get("/", (req,res)=>{
  
    res.render("home")
});

app.get("/Registration",(req,res)=>{
    res.render("registration")
});

app.get("/roomListing",(req,res)=>{
   //var rooms=[{title:"Lovely Room in Paris",
            //   price:"$193 CAD/night",
    //           img:"image/room1.jpeg},

    //          {title:"Romantic Cabana with view",
    //           price:"$234 CAD/night",
//               img:"image/room2.jpeg"},

//               {title:"The Joshua Tree House",
    //            price:"$143 CAD/night",
//                img:""image/room3.jpeg""},

//               {title:"Unique Cobb Cottage - 2beds",
    //            price:"$76 CAD/night",
//                img:"image/room4.jpeg"},

//               {title:"Stylish Downtown Cozy room",
    //            price:"$98 CAD/night",
//                img:"image/room5.jpeg"},

//               {title:Private Studio Flat,
    //            price:$167 CAD/night,
//                img:"image/room6.jpeg"},
//];
//res.render("roomListing",{
//Rooms:rooms
//       });   
//});
  
    res.render("roomListing")   
    });


app.listen(PORT,()=>{
    console.log(`The server is connected to :${PORT}`);
});
