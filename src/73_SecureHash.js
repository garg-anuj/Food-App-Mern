const bcrypt = require("bcryptjs");

const securePassword = async(password)=>{
    const passwordHash=await bcrypt.hash(password,10); //hme use asyn krna chiye taki baki kaam bhi hota rhe sync me ruk jata hai
    console.log(passwordHash)

    // for checking password hm new password ke hash value ko purani hash value ko match krenge
    const check_Hash=await bcrypt.compare("marvel",passwordHash); //hme use asyn krna chiye taki baki kaam bhi hota rhe sync me ruk jata hai
    console.log(check_Hash)

}


securePassword("marvel");  