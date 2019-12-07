const express= require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const methodOverride = require('method-override');
const fileupload = require("express-fileupload");
const session = require("express-session");


require("dotenv").config({path:'./config/keys.env'});

//import router objects
const generalRoutes = require("./routes/General");
const userRoutes = require("./routes/User");
const roomRoutes = require("./routes/Room");



const app= express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileupload())

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.static("public"));


app.use(session({secret:"This is my secret key. This should not be shown to everyone"}));
//inja route haye ke mikhay import koni ro miari az route app.use("/",productRoutes);

app.use((req,res,next)=>{
        res.locals.user= req.session.userInfo;
        res.locals.admin= req.session.admin;
        next();
    });

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS

app.use('/room',roomRoutes);
app.use("/",generalRoutes);
app.use("/user",userRoutes);


app.use("/",(req,res)=>{
    res.render("General/404");
});



const DBURL= "mongodb+srv://fbrhan:Salsa!193@fatemeh-symtc.mongodb.net/form?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true,
    useUnifiedTopology: true })

.then(()=>{
    console.log(`Database is connected`)
})

.catch(err=>{
    console.log(`Something went wrong : ${err}`);
});

  
const PORT=process.env.PORT || 7000;

app.listen(PORT,()=>{
    console.log(`The server is connected to :${PORT}`);
});
