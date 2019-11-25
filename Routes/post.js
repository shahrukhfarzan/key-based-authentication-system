const router = require('express').Router();
const verify = require('../verifyToken');
router.get('/' ,verify, (req,res)=>{
    res.json({
        posts:{
            title:'Title',
            descrption:'Random Data'
        }
    });
});
module.exports= router;