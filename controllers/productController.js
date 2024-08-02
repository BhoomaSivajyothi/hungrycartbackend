const  Product=require('../models/Product')
const Firm=require('../models/Firm')
const multer=require('multer')
const path=require('path')     


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+path.extname(file.originalname) );
    },
  })
  const upload = multer({ storage: storage });

  const addProduct= async(req,res)=>{

  try {
    const{productName,price, category, bestseller,description}=req.body
  const image = req.file ? req.file.filename : undefined;

    const firmId=req.params.firmId
 
    const firm= await Firm.findById(firmId)
  
   if(!firm){
     return  res.status(404).json({error:'No firm found'})
   }
   console.log(firm)
   const product= new Product({
    productName,price, category, bestseller,description,image,firm:firm._id,
   })  
   const savedProduct=await product.save()
   console.log(savedProduct)
    firm.product.push(savedProduct)
    await firm.save()
     res.status(200).json(savedProduct)

  } catch (error) {
    console.error(error)
    res.status(500).json({error:"Internal server error"})
  }
  }

  const getProductsByFirm= async(req,res)=>{
   try {
      const firmId=req.params.firmId;
     const  firm =await Firm.findById(firmId)
     if(!firm){
      return res.status(404).json({error:"No firm found"})
     }
     const resName=firm.firmName;
     const products=await Product.find({firm:firmId})
    res.status(200).json({resName,products})
   } catch (error) {
     console.error(error)
    res.status(500).json({error:"Internal server error"})
   }

  }
  const deleteProductById=async(req,res)=>{
    try {
     const productId=req.params.productId;
     const deleteProduct=await Product.findByIdAndDelete(productId)
     if(!deleteProduct){
       return res.status(404).json({error:"No Product Found"})
     }
      res.status(200).json({Message:" Product deleted sucessfuly"})
    } catch (error) {
      console.error(error);
       res.status(500).json({ error: "internal server error" });
    }
   
   }

  module.exports = {addProduct: [upload.single('image'), addProduct],getProductsByFirm,deleteProductById}