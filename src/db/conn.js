const mongoose = require("mongoose");
require('dotenv').config();
mongoose.set('strictQuery', false);

// mongoose.connect("mongodb://0.0.0.0:27017/Registration-Form",{ useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology:true})
// .then(()=>{
//     console.log("connection Succesful......")
// })
// .catch((e)=>{
//     console.log(e)
// });

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connection Succesful......")
    })
    .catch((e) => {
        console.log(e)
    });