require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn")
const path = require("path");
const hbs = require("hbs")
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
//  
const { json } = require("express")
const bcrypt = require("bcryptjs");

const port = process.env.PORT || 8000;

const Registred_dbs = require("./models/Registred")


const staticPath =path.join(__dirname,"../public");
const hbs_Path = path.join(__dirname,"../templates/views");
const partials_Path = path.join(__dirname,"../templates/partials");


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));   

app.use(express.static(staticPath));
app.set("view engine","hbs")
app.set("views",hbs_Path )
hbs.registerPartials(partials_Path)
// app.use(express.json())  
// app.use(express.urlencoded({ extended: false })); 
// html form ke andr jo bhi likha hai use get 
// krne ke liye hm iska use krte hai


// -----------------------------------------------ORDERS---------------------------------------------------------------------------------------------

app.get("/orders",auth,async(req,res)=>{
    console.log("from orders side")
    try{

            res.render("foodPrice");
        console.log(`token from cookies :- ${req.cookies.tokens_login}`);
        
    }catch(e){res.status(404).send("Something is Wrong In Orders")} 
})


// -----------------------------------------------LOGOUT---------------------------------------------------------------------------------------

app.get("/logout", auth, async(req,res)=>{
    try{

        // console.log("in logout:- "+current_token)
        // console.log(req.userer_db)

        //cuurent tokent ko compare krwaayenge dbs ke others tokens se matching wale ko remove kr denge  
        req.user_db.tokens = req.user_db.tokens.filter((curentElement)=>{
            return !(curentElement.token==req.current_token)
        });
        
        res.clearCookie("tokens_login");
        console.log("logout successfully");
        await req.user_db.save();
        res.render("Login");

    }catch(e){res.status(500).send(e)}

})

// ---------------------------------------REGISTER------------------------------------------------------------------------------------------------

app.get("/register",(req,res)=>{
    res.render("registration");
});
app.get("/",(req,res)=>{
    res.render("registration");
});



app.post("/register",async(req,res)=>{

    try{
        // console.log(req.body.lname);
        // console.log(req.body.fname);
        // res.send(`${req.body.lname} ${req.body.fname} ${req.body.phone}`);
        

        const result = new Registred_dbs({
            fname:req.body.fname,
            lname:req.body.lname,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender,
            age:req.body.age,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        });
        // console.log('result:- '+result);
        

        const see_token = await result.generateToken();
        console.log(" check resulted token :-"+ see_token)
        // console.log('result after tokens:- '+result);
        res.cookie("tokens_inside ", see_token, {
            expires:new Date(Date.now()+300000),
            httpOnly:true   //iske use se isme koi change nhi kr skta client side pr
        });



    //data ko get krna hai pehle or  Save krne se pehle is data ke password ko secure krna hai by hashing or iski koo concept of middleware  2 chij ke bech me work ho rha hoo 

    //    console.log(`check this:- ${this.fname}`);
        const registered_save = await result.save();
        res.status(201).render("Login");
        // res.status(201).send(`${req.body.lname} ${req.body.fname} ${req.body.phone} `);
        

        // const cpassword=req.body.confirmpassword
        // const password=req.body.password
        // if(password==cpassword){

        // }else{
        //     res.send("password are not matching")
        // }


    }catch(e){
        res.status(404).send(e);
    } 
});

// ----------------------------------------------------LOGIN------------------------------------------------------------------------------------


app.get("/login",(req,res)=>{
    res.render("Login");  
});



app.post("/login",async(req,res)=>{
    // console.log(see_token)
    // const see_token = await email_ki_details.generateToken();
    // console.log(see_token)

    try{
        
        // console.log(`email:${user_email} password:${user_password}`)

        const user_email = req.body.email;
        const user_password = req.body.password;
        // console.log("1st"+user_email);

        
       
        const email_ki_details=await Registred_dbs.findOne({email:user_email});
        // console.log(`check name ${check_data.lname}`)
        // console.log(email_ki_details)

        

        const comapare_password = await bcrypt.compare(user_password,email_ki_details.password);
        const see_token = await email_ki_details.generateToken();
        console.log("in login:- "+see_token)

        res.cookie("tokens_login", see_token, {
            expires:new Date(Date.now()+69000000),
            httpOnly:true,   //iske use se isme koi change nhi kr skta client side pr
            // secure:true
        });

        if(comapare_password){

            
            // const verifyToken = await jwt.verify(see_token,  "SecretKey")
            // console.log(verifyToken)
            res.status(201).render("foodPage");
        } else{ res.send("Incorrect password")}
    
        // res.send(email_ki_details);
        // console.log(email_ki_details);
        
    }catch(err){res.status(404).send("Invalid Email")}
    
});


// ------------------------------------------------TEST--------------------------------------------------------------------------------------------


const securePassword = async(password)=>{
    const passwordHash=await bcrypt.hash(password,10); //hme use asyn krna chiye taki baki kaam bhi hota rhe sync me ruk jata hai
    console.log(passwordHash)

    // for checking password hm new password ke hash value ko purani hash value ko match krenge
    const check_Hash=await bcrypt.compare("amit",passwordHash); //hme use asyn krna chiye taki baki kaam bhi hota rhe sync me ruk jata hai
    console.log(check_Hash)
}

// securePassword("1234");



const jwt = require("jsonwebtoken");
const createToken = async()=>{
   const token = await jwt.sign({_id:"dfdhfbhsdbfhsbfhbsdfbsgf"}, "secretKey_minimum_32character") 
   console.log(`Take Token :- ${token}`);

   const verifyToken = await jwt.verify(token, "secretKey_minimum_32character")
//    console.log(`verify Token :- ${verifyToken}`);
   console.log(verifyToken)
//    const verifyToken_expiry = await jwt.sign({_id:"dfdhfbhsdbfhsbfhbsdfbsgf"}, "secretKey_minimum_32character", {expiresIn:"2 seconds"})

}
// createToken();
  
// --------------------------------------------END----------------------------------------------------------------------------------------





app.listen(port,()=>{
    console.log(`listening port no ${port}`)
 
})
