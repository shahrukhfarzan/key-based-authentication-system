const jwt = require('jsonwebtoken') ; 
module.exports =  function(req , res ,next){
    const token = req.header('auth-token');
    if(!token)return res.send("Invalid Pemission").status(400) ;
    try{
        const verified  = jwt.verify(token , process.env.TOKEN_SECRET) ;
        req.user = verified ;
        next();
    }catch(err){
        res.send("Error").status(400);
    }
}