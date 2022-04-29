const mongoose = require('mongoose');

const W_productVariantSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    inventory: {
        type: Number,
        required: true
    },
    barcode: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    }

})

W_productVariantSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

W_productVariantSchema.set('toJSON', {
    virtuals: true
})

exports.W_productVariant = mongoose.model('W_productVariant', W_productVariantSchema);