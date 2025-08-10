import cloudinary  from '../config/cloudinary.js'
import Product from '../modules/Product.js';




//Listing product to fetch all hostels data for users

export const listHostels=async(req,res)=>{
    try {
      const hostel=await Product.find({})
      res.json({ success: true, hostel });
  } catch (error) {
    console.log(error)
    res.json({ success: false, mssg: error.message });
  }
};

//Single hostel info

export const Singelhostelinfo=async(req,res)=>{

  const {id}=req.params

    try {
      const hostel=await Product.findById(id);
     
     if (!hostel) {
      return res.json({ success: false, mssg: "Hostel not found" });
    }
    res.json({ success: true, hostel});
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};




