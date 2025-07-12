import mongoose from 'mongoose'


const productschema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
     price: { type: Number, required: true },
  image: {type:Array,required:true},  
  category: { type: String, required: true },
  sizes: { type: [String] }, //single ,double
  date: { type: Date, default: Date.now }
})

const Product=mongoose.models.Product|| mongoose.model('Product',productschema)

export default Product;