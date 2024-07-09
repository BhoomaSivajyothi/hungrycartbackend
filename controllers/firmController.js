const Firm = require("../models/Firm");
const Vendor = require("../models/Vendor");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  
  try {
    console.log("Apl called");
    const { firmName, area, category, region, offers } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const vendor = await Vendor.findById(req.vendorId);
    // console.log(vendor);
    if (!vendor) {
      return res.status(401).json({ error: "vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offers,
      image,
      vendor: vendor._id,
    });
    const savedFirm = await firm.save();
    // console.log(savedFirm)
    console.log(vendor)
    vendor.firm.push(savedFirm);
      // console.log(vendor)
    await vendor.save();
    res.status(200).json({ message: "Firm added sucessfully" });
  } 
  catch (error) {
    console.log("came to catch block");
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

const deleteFirmById=async(req,res)=>{
 try {
  const firmId=req.params.firmId;
  const deleteFirm=await Firm.findByIdAndDelete(firmId)
  if(!deleteFirm){
    return res.status(404).json({error:"No Firm Found"})
  }
   res.status(200).json({Message:" Firm deleted sucessfuly"})
 } catch (error) {
   console.error(error);
    res.status(500).json({ error: "internal server error" });
 }

}

module.exports = { addFirm: [upload.single("image"), addFirm],deleteFirmById };
