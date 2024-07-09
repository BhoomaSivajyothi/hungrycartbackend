const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')

const dotenv=require('dotenv')

dotenv.config()
const secretkey=process.env.WhatIsYourName


const verifyToken=async(req, res , next)=>{
const token=req.headers.token
    if(!token){
        return res.status(401).json({error:'Token is Required'})
    }
    try {
        const decoded=jwt.verify(token,secretkey)
        const vendor=await Vendor.findById(decoded.vendorId) 
        if(!vendor){
            res.status(401).json({error:"Vendor not found"})
        }
         req.vendorId=vendor._id 
         next()

    } catch (error) {
    console.error(error)
    res.status(500).json({error:'internal server error'})
    }
}

module.exports=verifyToken