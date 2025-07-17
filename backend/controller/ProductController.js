import cloudinary  from '../config/cloudinary.js'
import Product from '../modules/Product.js';

export const addHostel = async (req, res) => {
  try {
    const { name, description, price,address,email,phone ,image, category } = req.body;
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
            name,description,price:Number(price),category,image:imageurls,date:Date.now(),address,email,phone
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

  const {id}=req.params

    try {
      const hostel=await Product.findById(id);
      console.log("Single hostel info:", hostel);
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

//edit hostel info
export const edithostel = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category,address,phone,email } = req.body;

  // Handle uploaded images
  const images = req.files; 
  const imagePaths = {
    image1: images?.image1?.[0]?.path || undefined,
    image2: images?.image2?.[0]?.path || undefined,
    image3: images?.image3?.[0]?.path || undefined,
    image4: images?.image4?.[0]?.path || undefined,
  };


  const updateData = {
    name,
    description,
    price: Number(price),
    category,
    address,email,phone
  };

  // Only add image fields if new images are uploaded
  for (const key in imagePaths) {
    if (imagePaths[key]) {
      updateData[key] = imagePaths[key];
    }
  }

  try {
    const updatedhostel = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ success: true, hostel: updatedhostel });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, mssg: "Failed to update hostel" });
  }
};

