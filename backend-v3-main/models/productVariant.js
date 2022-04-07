const mongoose = require('mongoose');

const productVariantSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    size:{
        type: String,
        required: true        
    },
    inventory: {
     type: Number,
     required: true
    },
    barcode:{
        type: Number,
        required: true
    },
    available:{
        type: Boolean,
        default: true
    }

})

productVariantSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

productVariantSchema.set('toJSON', {
    virtuals: true
})

exports.ProductVariant = mongoose.model('ProductVariant', productVariantSchema);