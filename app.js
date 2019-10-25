const express= require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const app=express();
const PORT=process.env.PORT || 5000;
//const PORT=3000;

app.use(express.static('public'))


//This tells Express that I want to use handlebars as my TEMPLATING ENGINE!!!!!!!!!!
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req,res)=>{
  
    res.render("home")
});

app.get("/Registration",(req,res)=>{
    res.render("registration")
});

app.get("/login",(req,res)=>{
    res.render("login")
});


app.post("/login",(req,res)=>{


    const errors=[];

    if(req.body.UserName=""){
        errors.push("please enter  a User Name")
    }


    if(req.body.PassWord=""){
        errors.push("please enter  a Password")
    }

    
    if(errors.length>0){

        res.render("message",{
            message:errors
        })
    }
    else
    {
       // SEND SMS TEXT
//mirir to site twilio account misazi (Pourtalebi!193)bad onja behet in do taye paeen ro mide to safhe aval coppy mikoni inja
      const accountSid = 'ACcc6d4f38a74b9f4aa3b7e3c2ab7f1152';
       const authToken = '9a59b9fdffcec2f49f47332f161b7c23';
       const client = require('twilio')(accountSid, authToken);
       
       client.messages
         .create({
            body: `${req.body.message}`,
            from: '+14379886160',
            to: `${req.body.phoneNo}`
          })
         .then(message => console.log(message.sid))
         .catch(error => console.log(`${error}`));

    
       // SEND THE EMAIL
       const nodemailer = require('nodemailer');
       const sgTransport = require('nodemailer-sendgrid-transport');

       const options = {
          auth: {
              api_key: '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'
          }
      }
      const mailer = nodemailer.createTransport(sgTransport(options));

      const email = {
          to: `${req.body.email}`,
          from: 'borhan.manager@gmail.com',
          subject: 'Testing',
          text: `${req.body.message}`,
          html: `${req.body.message}`
      };
       
      mailer.sendMail(email, (err, res)=> {
          if (err) { 
              console.log(err) 
          }
          console.log(res);
      });
      res.redirect("/dashboard");
  }
});
//This route is use to load the dashboard page
app.get("/dashboard",(req,res)=>
{
  res.render("userDashboard");
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
