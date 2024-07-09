const Vendor=require('../models/Vendor')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const dotenv=require('dotenv')
dotenv.config()
 const secretkey=process.env.WhatIsYourName
const vendorRegister=async(req,res)=>{
  const {username,email,password} =req.body;
  try{
    const vendorEmail= await Vendor.findOne({email})
    if(vendorEmail){
        return res.status(400).json({message:"email already taken"})
    }
    const hashPasword= await bcrypt.hash(password,10)

    const newVendor=new Vendor({
        username,
        email,
        password:hashPasword
    })
    await  newVendor.save()
    res.status(200).json({message:'vendor registerd sucessfully'})
  } 
  catch(error){
    console.error(error)
    res.status(500).json({error:'internal server error'})
  }
}

const vendorLogin=async(req,res)=>{
  const {email,password}=req.body
  try {

    const vendor=await Vendor.findOne({email})
    if(!vendor || !(await bcrypt.compare(password,vendor.password))){
       return res.status(401).json({error:"invalid username and password"})
    }
    const token =jwt.sign({vendorId:vendor._id},secretkey,{expiresIn:"1h"})
    res.status(200).json({sucess:" sucessfully user login",token})
    console.log(email,token)

  } catch (error) {
    console.log(error)
    res.status(500).json({error:"internal server error"})
  }
}
   
 const getAllVendors=async(req,res)=>{
 try {
  const vendors= await Vendor.find().populate("firm")
  res.json(vendors)
  
 } catch (error) {
  res.status(500).json({error:"internal server error"})
  
 }
 }  

 const getVendorById=async(req,res)=>{
  const vendorId= req.params.id
  try {
    const vendor=await Vendor.findById(vendorId).populate('firm')
    if(!vendor){
        res.status(404).json({error:"vendor not found"})
    }
    res.status(200).json(vendor)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Internal Error"})

  }
}


module.exports = {vendorRegister, vendorLogin,getAllVendors,getVendorById}


