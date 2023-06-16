// require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const Registred_dbs = require("../models/Registred")


const auth = async(req,res,next)=>{
    
    try{
        current_token = req.cookies.tokens_login;
        // console.log(`hellooooooo auth side:- ${current_token}`)
        const verifyuser =await jwt.verify(current_token, process.env.SECRET_KEY)
        // console.log(verifyuser)
        // console.log(verifyuser._id)
        

        // console.log("verify:- "+verifyuser.fname)
        const dbs_data_by_using_token =await Registred_dbs.findOne({_id:verifyuser})
        // console.log(dbs_data_by_using_token)
        // console.log(dbs_data_by_using_token.fname)
        // console.log("niche tokens ke bare me ")
        // console.log(dbs_data_by_using_token.tokens[0])


        req.current_token=current_token;
        req.user_db= dbs_data_by_using_token;
        console.log("auth function")
        // console.log(req.token)

       
       
        next();
 
    }catch(e){res.status(401).send(e);}
    
}


module.exports=auth;