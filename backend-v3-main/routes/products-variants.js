const { ProductVariant } = require("../models/productVariant");
const { Product} = require("../models/product");
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

},
{
    limits: { fieldNameSize: 25 * 1024 * 1024,
              files: 10,
              fields: 10 }
})



router.get(`/`, async (req, res) => {
    const variantsList = await ProductVariant.find();

    if (!variantsList) {
        res.status(500).json({
            success: false
        })
    }
    res.send(variantsList);
})


router.get('/product/:id', async (req, res) => {

    const prodId = req.params.id;
    const variantsList = await ProductVariant.find({'product': prodId}).populate({
        path: 'product',
        populate: {
            path: 'image'
        }
    });

    if (!variantsList) {
        return res.status(400).send('No variants available')
    }

    res.send(variantsList);
})

router.get('/product/:id/form/edit', async (req, res) => {

    const variantId = req.params.id;
    const variantsList = await ProductVariant.findById(variantId).populate({
        path: 'product',
        populate: {
            path: 'image'
        }
    });

    if (!variantsList) {
        return res.status(400).send('No variants available')
    }

    res.send(variantsList);
})



router.post('/', uploadOptions.single('image'), async (req, res) => {

    let product = await Product.findById(req.body.product);
    if (!product) return res.status(400).send('Invalid product')


    let productVariant = new ProductVariant({
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

router.put('/product/:id/form/edit', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Variant Id')
    }

    //Category test
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid category');

    //Product test
    // const product = await Product.findById(req.params.id);
    // if (!product) return res.status(400).send('Invalid product');

    const variant = await ProductVariant.findById(req.params.id);
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


    const updatedVariant = await ProductVariant.findByIdAndUpdate(
        req.params.id, {
            product: req.body.product,
            size: req.body.size,
            inventory: req.body.inventory,
            barcode: req.body.barcode, 
            available: req.body.available    
        },{
            new: true
        }
    )

    if (!updatedVariant)
        return res.status(400).send('the variant cannot be updated');

    res.send(updatedVariant);
})




router.delete('/:id', (req,res)=>{
    ProductVariant.findByIdAndRemove(req.params.id).then(variant =>{
        if(variant){
            return res.status(200).json({
                success: true,
                message:'variant deleted'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'variant cannot be deleted'
            });
        }
    }).catch(err =>{
        return res.status(400).json({
            success: false,
            error: err
        });
    })
})


module.exports = router;
