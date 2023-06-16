


app.get("/login",(req,res)=>{
    res.render("Login");
});



app.post("/login",async(req,res)=>{

    try{
        // console.log(`email:${user_email} password:${user_password}`)

        const user_email = req.body.email;
        const user_password = req.body.password;
        // console.log("1st"+user_email);

        
       
        const email_ki_details=await Registred_dbs.findOne({email:user_email});
        // console.log(`check name ${check_data.lname}`)

        if(email_ki_details.password==user_password){
            res.status(201).render("foodPage");
        } else{ res.send("Incorrect password")}
    
        // res.send(email_ki_details);
        // console.log(email_ki_details);
        
    }catch(err){res.status(404).send("Invalid Email")}
    
});
