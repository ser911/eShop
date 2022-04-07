const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    m:{
        type: Boolean,
        required: true
    },
    w:{
        type: Boolean,
        required: true
    }
})

brandSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

brandSchema.set('toJSON', {
    virtuals: true
})

exports.Brand = mongoose.model('Brand', brandSchema);