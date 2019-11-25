const router = require('express').Router();
const userModel = require('../Model/user');
//Validation
const valid = require('@hapi/joi');
const bcrypt = require('bcryptjs') ; 
const jwt = require('jsonwebtoken');

const schema = valid.object({
    name :valid.string().min(6).required(),
    email:valid.string().min(6).required().email(),
    password:valid.string().min(6).required ()
}); 
const loginSchema  = valid.object({
    email:valid.string().min(6).required().email() , 
    password:valid.string().min(6).required()
});
router.post('/register' , async(req , res)=>{
    //validate the data
   try{
    const {error} = schema.validate(req.body);
        if(error) return  res.send(error.details[0].message).status(400) ; 
        //if user email exist
        const emailExist  = await userModel.findOne({email:req.body.email}) ; 
        if(emailExist) return res.send("Email already exist").status(400); 
        var salt = await bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = new userModel({
            name:req.body.name , 
            email:req.body.email , 
            password:hash
        });
        try{
            user.save().then(result=>{
                res.status(200).send(result.name) ; 
            });
            
        }catch(err){
            res.send(err);
            
        }
        
    // res.send(error.details[0].message);
   
   }catch(err){
       console.log(err);
       
   }

}) ; 
router.post('/login' , async(req , res)=>{
    const {error} = await loginSchema.validate(req.body);
    if(error) return  res.send(error.details[0].message).status(400) ; 
    const emailExist  = await userModel.findOne({email:req.body.email}) ; 
    if(!emailExist) return res.send("Invalid Request").status(400); 

   try{
    const validPass = await bcrypt.compare(req.body.password ,
        emailExist.password)  ; 
   if(!validPass) return res.send("Invalid Login") .status(400) ; 
    const token = jwt.sign({_id:emailExist._id} , process.env.TOKEN_SECRET);
   res.header('auth-token' ,token).send(token);
   }catch(err){
       console.log(err);   
   }
}) ; 
module.exports= router;