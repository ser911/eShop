const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    sex:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default: ''
    },
    images:[{
            type: String,          
    }],
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        required: true        
    },
    price:{
        type: Number,
        required: true
    },
    isFeatured:{
      type: Boolean,
      default: false
    },
    rating:{
        type: Number,
        default: 0,
    },
    color:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        default: 0
    },
    factoryCode:{
        type: String,
    },
    variants:[{
        type: mongoose.Schema.Types.ObjectId
    }]
})

productSchema.virtual('id').get(function (){
    return this._id.toHexString();
})
productSchema.set('toJSON',{
    virtuals: true
})


exports.Product = mongoose.model('Product', productSchema);     