const { W_product } = require("../models/w-product")
const { W_productVariant } = require("../models/w-productVariant");
const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({
    storage: storage,

}, {
    limits: {
        fieldNameSize: 25 * 1024 * 1024,
        files: 10,
        fields: 10
    }
})

router.get(`/`, async (req,res) =>{
    const w_variantsList = await W_productVariant.find();

    if(!w_variantsList){
        res.status(500).json({
            success: false
        })
    }
    res.send(w_variantsList);
})

router.get('/women-product/:id', async (req, res) => {

    const prodId = req.params.id;
    const w_variantsList = await W_productVariant.find({
        'product': prodId
    }).populate({
        path: 'product',
        populate: {
            path: 'image'
        }
    });

    if (!w_variantsList) {
        return res.status(400).send('No variants available')
    }

    res.send(w_variantsList);
})

router.get('/women-product/:id/form/edit', async (req, res) => {

    const variantId = req.params.id;
    const w_variantsList = await W_productVariant.findById(variantId).populate({
        path: 'product',
        populate: {
            path: 'image'
        }
    });

    if (!w_variantsList) {
        return res.status(400).send('No variants available')
    }

    res.send(w_variantsList);
})

router.post('/', uploadOptions.single('image'), async (req, res) => {

    let w_product = await W_product.findById(req.body.product);
    if (!w_product) return res.status(400).send('Invalid product')

   
    let productVariant = new W_productVariant({
        product: req.body.product,
        size: req.body.size,
        inventory: req.body.inventory,
        barcode: req.body.barcode,
        available: req.body.available
    })

    productVariant = await productVariant.save();



    if (!productVariant)
        return res.status(404).send('the variant cannot be created');

    res.send(productVariant);
})

router.put('/women-product/:id/form/edit', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Variant Id')
    }

    //Category test
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid category');

    //Product test
    // const product = await Product.findById(req.params.id);
    // if (!product) return res.status(400).send('Invalid product');

    const variant = await W_productVariant.findById(req.params.id);
    if (!variant) return res.status(400).send('Invalid variant')

    //File exists check
    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = variant.image;
    }


    const updatedVariant = await W_productVariant.findByIdAndUpdate(
        req.params.id, {
            product: req.body.product,
            size: req.body.size,
            inventory: req.body.inventory,
            barcode: req.body.barcode,
            available: req.body.available
        }, {
            new: true
        }
    )

    if (!updatedVariant)
        return res.status(400).send('the variant cannot be updated');

    res.send(updatedVariant);
})




router.delete('/:id', (req, res) => {
    W_productVariant.findByIdAndRemove(req.params.id).then(variant => {
        if (variant) {
            return res.status(200).json({
                success: true,
                message: 'variant deleted'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'variant cannot be deleted'
            });
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        });
    })
})



module.exports = router;


