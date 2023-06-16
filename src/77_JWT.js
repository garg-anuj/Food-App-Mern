const jwt = require("jsonwebtoken");
const createToken = async()=>{
   const token = await jwt.sign({_id:"dfdhfbhsdbfhsbfhbsdfbsgf"}, "secretKey_minimum_32character") 
   console.log(`Take Token :- ${token}`);

   const verifyToken = await jwt.verify(token, "secretKey_minimum_32character")
//    console.log(`verify Token :- ${verifyToken}`);
   console.log(verifyToken)
//    const verifyToken_expiry = await jwt.sign({_id:"dfdhfbhsdbfhsbfhbsdfbsgf"}, "secretKey_minimum_32character", {expiresIn:"2 seconds"})

}


createToken();
app.get("/jwt",(req,res)=>{
    // console.log(jwt);
    res.send("jwt")

});