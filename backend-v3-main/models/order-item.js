const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    variant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVariant'
    },
        wProduct: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'W_product'
            },
            wVariant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'W_productVariant' 
            }
})

exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
