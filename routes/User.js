const express = require('express')
const router = express.Router();
const bcrypt= require("bcryptjs");

const Forms= require("../models/User");
//const Booking= require("../models/Booking");
const hasAccess= require("../middleWare/auth");
const isAdmin= require("../middleWare/userCheck");

//This route is use to load the dashboard page


router.get("/registration",(req,res)=>{
    res.render("User/registration")
});


router.post("/registration",(req,res)=>{
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

    if((req.body.FirstName !== "")&&(letter.test(req.body.FirstName))){
        RegErrors.push("A FirstName should contin only letters")
    }
//**** */
    if(req.body.FirstName ==Forms.FirstName)
    {
        RegErrors.push("UserName already exist")
    }
    //**** */
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
    if(req.body.confirmpassword !== req.body.password)
    {
        RegErrors.push("Password dose not match!!!")
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
        res.render("User/registration",{
            message:RegErrors
        })
    }

    else
    {
    const formData ={
        email:req.body.email,
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
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
      res.redirect("/user/login");
    }
}); 

//This route is use to load the dashboard page
// router.get("/dashboard",(req,res)=>
// {
//   res.render("User/userDashboard");
// });
//log in

router.get("/login",(req,res)=>{

    res.render("User/login");
});

router.post("/login",(req,res)=>{
  const errors=[];
  
    if(req.body.email =="")
    {
        errors.push("please enter  a User Name")
    }

    if(req.body.password=="")
    {
        errors.push("please enter  a Password")
    }
    
    if(errors.length > 0 )
    {
        res.render("User/login",{
            message:errors
        })
    }
    else
    {
        const loginData = {
            email : req.body.email,
            password : req.body.password
        }
    
        // console.log(loginData.email)
        // console.log(loginData.password);
        Forms.findOne({email:loginData.email})
        .then(form=>{
    
            //This means that there was no matching email in the database
            if(form==null)
            {
                errors.push("Sorry your email was not found");
                res.render("User/login",{
                    message: errors
                })
            }
            // if email exist 
            else
            {
                // console.log(`Login data :${loginData.password}`);
                // console.log(`Hash Password : ${form.password}`)
                bcrypt.compare(loginData.password,form.password)
                .then(isMatched=>{
                    if(isMatched==true)
                    {
                     //Create session
                        req.session.userInfo=form;
                            if(req.session.userInfo.type =="Admin")
                            { 
                                req.session.admin = "yes"
                                   res.redirect("/User/adminDashboard");
                            }

                            else
                            {
                                 res.redirect("/User/dashboard")
                            } 
                    }

                    else
                    {
                        errors.push("Sorry, your password does not match");
                        res.render("User/login",{
                            message:errors
                        })
                    }
                })
                .catch(err=>console.log(`Error :${err}`));
            }
            //****** */
    })
    .catch(err=> console.log(`Something occured ${err}`));
}
});

router.get("/logout",(req,res)=>{

    //This destorys the session
    req.session.destroy();
    res.redirect("/");

});
router.get("/dashboard",hasAccess,(req,res)=>
{
  res.render("User/userDashBoard");
});

router.get("/adminDashboard",hasAccess,isAdmin,(req,res)=>
{
  res.render("User/adminDashboard");
});
module.exports=router;