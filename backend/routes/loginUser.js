const express=require("express")
const router=express.Router()



router.post("/loginUser",(req,res)=>{


    res.status(200).json({"success":req.body.name})
})



module.exports=router