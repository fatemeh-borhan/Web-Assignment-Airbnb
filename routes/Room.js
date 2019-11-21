// const express = require('express')
const router = express.Router();

//const Product= require("../models/Room");
//hanoz madoule nasakhtim vase in bayad besazi bad ino require koni


router.get("/roomListing",(req,res)=>{

     res.render("Room/roomListing");   
     });

module.exports=router;