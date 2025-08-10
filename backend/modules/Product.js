import mongoose from 'mongoose'


const productschema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  sizes: { type: [String] },
  date: { type: Date, default: Date.now },

  
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const Product=mongoose.models.Product|| mongoose.model('Product',productschema)

export default Product;