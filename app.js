const express= require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
//const popup=require('popups');
const app=express();
const PORT=process.env.PORT || 7000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const DBURL= "mongodb+srv://fbrhan:Salsa!193@fatemeh-symtc.mongodb.net/form?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true,
    useUnifiedTopology: true })

.then(()=>{
    console.log(`Database is connected`)
})

.catch(err=>{
    console.log(`Something went wrong : ${err}`);
})


app.get("/", (req,res)=>{
  
    res.render("home")
});


app.get("/login",(req,res)=>{

    res.render("login")
});

app.post("/login",(req,res)=>{
  const errors=[];

    if(req.body.UserName =="")
    {
        errors.push("please enter  a User Name")
    }

    if(req.body.PassWord=="")
    {
        errors.push("please enter  a Password")
    }

    if(errors.length > 0 )
    {
        res.render("login",{
            message:errors
        })
    }
    else
    {
      res.redirect("/dashboard");
    }
});

//This route is use to load the dashboard page
app.get("/dashboard",(req,res)=>
{
  res.render("userDashBoard");
});

app.get("/registration",(req,res)=>{
    res.render("registration")
});


app.post("/registration",(req,res)=>{
    const RegErrors=[];
    const letters=/[^0-9a-zA-Z]/;
    const letter=/[^a-zA-Z]/;

    if(req.body.email == "")
    {
        RegErrors.push("please enter a email address")
    }

    if(req.body.FirstName == "")
    {
        RegErrors.push("please enter  a First Name")
    }

    // if(req.body.FirstName.search(/[a-zA-Z]/ < 0)){
    //     RegErrors.push("A first name should only contain letters") 
    //  }
    if((req.body.FirstName !== "")&&(letter.test(req.body.FirstName))){
        RegErrors.push("A FirstName should contin only letters")
    }


    if(req.body.LastName == "")
    {
        RegErrors.push("please enter a Last Name")
    }

    if((req.body.LastName !== "")&&(req.body.LastName.match(letter))){
         RegErrors.push("A LastName should contain only letters")
    }

    if(req.body.password == "")
    {
        RegErrors.push("please enter a Password")
    }

    if((req.body.password != "")&&(req.body.password.match(letters))){
         RegErrors.push("enter a password with letter and digit only") 
    }

    if((req.body.password != "") &&(req.body.password.length < 6 || req.body.password.length > 12) ){
        RegErrors.push("enter a password that is 6 to 12 characters") 
    }
    if(req.body.Month =="Month" ){
        RegErrors.push("please enter a valid Date(Month)")
    }

    if(req.body.Year =="Year" ){
        RegErrors.push("please enter a valid Date(Year)")
    }

    if(req.body.Day =="Day" ){
        RegErrors.push("please enter a valid Date(Day)")
    }
    
    if(RegErrors.length > 0 )
    {
        res.render("registration",{
            message:RegErrors
        })
    }

    else
    {
    const Schema = mongoose.Schema;
    const registerSchema = new Schema({
        email:  String,
        FirstName: String,
        LaststName: String,
        password:String,
        Month:String,
        Day:Number,
        Year:Number  
             }); 

    //This creates a Model called Tasks. This model represents our Collection in our database
    const Forms = mongoose.model('Forms', registerSchema);

    const formData ={
        email:req.body.email,
        FirstName:req.body.FirstName,
        LaststName:req.body.LastName,
        password:req.body.password,
        Month:req.body.Month,
        Day:req.body.Day,
        Year:req.body.Year
    }
    //To create a  Task document we have to call the Model constructor
    const form = new Forms(formData);
    form.save()
    .then(() => 
    {
    console.log('Form was inserted into database')
    })
    .catch((err)=>{
        console.log(`Form was not inserted into the database because ${err}`)
    }) 
    
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
          text: "You Have Been Successfuly Registered",
          html: "You Have Been Successfuly Registered"
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
