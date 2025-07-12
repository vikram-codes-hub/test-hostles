import cloudinary  from '../config/cloudinary.js'
import Product from '../modules/Product.js';

export const addHostel = async (req, res) => {
  try {
    const { name, description, price, image, category, sizes } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images=[image1,image2,image3,image4].filter((item)=>item!==undefined)

    const imageurls=await Promise.all(
        images.map(async(img)=>{
            const result=await cloudinary.uploader.upload(img.path,{resource_type:'image'});
            return result.secure_url;
        }))

        const productdata={
            name,description,price:Number(price),category,sizes:JSON.parse(sizes),image:imageurls,date:Date.now()
        }

        const product=new Product(productdata)
        await product.save()
    
    res.json({success:true,mssg:"Hostel Added"})
  }catch (error) {
    console.log(error)
        res.json({ success: false, mssg: error.message });
    }
}



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
    try {
      const {id}=req.body
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


//remove Prooduct info

export const removeHostel=async(req,res)=>{
    try {
      const {id}=req.body;
      await Product.findByIdAndDelete(id)
     res.json({ success: true, mssg: "Hostel removed"})
  } catch (error) {
     console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};
