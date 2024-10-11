import { Schema, model} from "mongoose";
const cart = new Schema( 
{
    cartBy:{
    type:String,
    required:true,
    },

    book:[
    {authorname:String,
     image:String,
     bookname:String,
     discountPrice:Number,
     price:Number,
     quantity:Number}],

    ispurchased:{
        type:Boolean,default:false},
        
    cartTotal:{type:Number}
}

)

export default model('Cart', cart);
