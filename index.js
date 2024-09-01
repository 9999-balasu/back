
const express=require("express");
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require('cors');
const app = express();


mongoose.connect( "mongodb+srv://hynda:bharg@cluster0.tmwop.mongodb.net/man?retryWrites=true&w=majority&appName=Cluster0").then(
    ()=>console.log('DB Connection established')
)

app.use(express.json());
app.use(cors({origin:"*"}))
app.post('/register', async(req,res)=>{
    try{
const{username,email,password,confirmpassword} = req.body;
let exist =await Registeruser.findOne({email:email})
if(exist){
   return res.status(400) .send('User Already Exist')
}
if(password!==confirmpassword){
    return res.status(400).send('passwords are not matching')
}
let newUser = new Registeruser({
    username,
    email,
    password,
    confirmpassword
})
await newUser.save();
res.status(200).send('Registered Successfully')
    }
    catch(error){
console.log(error)
return res.status(500).send('Internal Server Error')
    }
})

app.post('/login',async(req , res)=>{
   try{
const{email,password} = req.body;
let exist = await Registeruser.findOne({email});


if(!exist){
    return res.status(400).send('User Not Found');

}
if(exist.password !== password) {
    return res.status(400).send('Invalid credentials');
}
let payload ={
    user : {
        id : exist.id
    }
}

jwt.sign(payload,'JWT_SECRET=paste-the-generated-string-here',{expiresIn:3600000},
 (err,token)=>{
    if(err) throw err;
    return res.json({token})
 }  
)
   }
   catch(err){
    console.log(err);
    return res.status(500).send('Server Error')
   } 
})
app.get('/myprofile'  ,async(req, res)=>{
    try{
let exist = await Registeruser.findById(req.user.id);
if(!exist){
    return res.status(400).send('User not found');

}
res.json(exist);
    }
    catch(error){
 console.log(err);
 return res.status(500).send('Server Error') 
    }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log('Server running...')
})