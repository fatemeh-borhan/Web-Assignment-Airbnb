const express= require("express");
const exphbs  = require('express-handlebars');

const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.static('public'))


//This tells Express that I want to use handlebars as my TEMPLATING ENGINE!!!!!!!!!!
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get("/", (req,res)=>{
  
    res.render("home")
});

app.get("/Registration",(req,res)=>{
    res.render("Registration")
});

app.get("/roomListing",(req,res)=>{
    
    
    
    res.render("roomListing")   
    });


app.listen(PORT,()=>{
    console.log(`The server is connected to :${port}`);
});
