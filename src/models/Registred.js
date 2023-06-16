const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const RegistredSchema =new mongoose.Schema({
    fname:{
      type:String,
      required:true,
    },
    lname:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true,
      unique:true
    },
    gender:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true,
      unique:true
    },
    password:{
      type:String,
      required:true,
      unique:true
    },
    confirmpassword:{
      type:String,
      required:true,
      unique:true
    },
    
    age:{
      type:Number,
      required:true
    
    },
    tokens:[{
      token:{
        type:String,
        required:true}
    }]


});
                          //  generating Tokens
 
// .methods ko hm tbh hi call krte hai jbh hm instance ke sath work krte hoo 
// or agr direct collection ke sath work kr rhe hote toh  .use krte statics

RegistredSchema.methods.generateToken =async function(){
  try{

    const generate_token=  jwt.sign({_id:this._id}, process.env.SECRET_KEY);
    // console.log(`jwT_Token 1:- ${token}`);

    this.tokens=  this.tokens.concat({token:generate_token});
    await this.save();
    return generate_token;


  }catch(e){
    console.log("Something is wrong in tokens")
  }
}






                   //generating Hash Function



// yea pre 2 arguments leta hai :- 1st kis event se pehle or isme hm arrow function use nhi kr skte 
// kyuki isme hme this ke sath work krna pdta hai or arrow function me khud kaa this nhi hota 
// RegistredSchema.pre("save", OR save method se pehle kya krwana hai uska function joo ki hme password ko secure krwana hai)

RegistredSchema.pre("save", async function(next){
  // const passwordHash=await bcrypt.hash("password",10); //hme use asyn krna chiye taki baki kaam bhi hota rhe sync me ruk jata hai
  
  // console.log(`Current password :-${this.password}`)


  //yeah  modified isliye bc jbh hm register or password modified kre tbh hi hashi hoo
  //jise user password bhul jaye toh recover bhi kr ske 

  if(this.isModified("password")){         
      console.log(`password kaa plane Text :-${this.password}`)                     
    this.password =await bcrypt.hash(this.password,10)
      console.log(`password cypher text :-${this.password}`)
      // this.confirmpassword = undefined;
  }

   next();  // next mtlb hashing ke badh jo bhi krna hai wo call ho jayega jese ki save method
})

// const RegistredSchema =new mongoose.Schema({
//   fname:String,
//   lname:String

// });
 
  
  const Registred_List =new  mongoose.model('Registred_people', RegistredSchema);
 
  module.exports = Registred_List;

