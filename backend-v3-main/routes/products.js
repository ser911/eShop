const {Product} = require('../models/product');
const express = require ('express');
const router =  express.Router();
const  {Category} = require('../models/category')
const multer = require('multer');
const mongoose = require('mongoose');



//Multer config
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


// Get products with optional categories params
router.get(`/`, async (req, res) =>{
    // localhost:3000/api/v1/products?categories=2342342,234234
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})


router.get(`/prodname/:name`, async (req,res)=>{
    let prodName = req.params.name;

    const productsList = await Product.find({name: prodName});

    if(!productsList){
        res.status(500).json({success: false});
    }
    res.send(productsList);
})


router.get(`/brand/:id`, async (req,res)=>{

  let brand = {}

  if(req.query.brand){
      brand = {brand: req.query.brandId}
  }


 const productsByBrand = await Product.find(brand).populate('brand');


 if(!productsByBrand){
     res.status(500).json({success: false})
 }
 res.send(productsByBrand);

})



// Get specific product
router.get(`/:id`, async (req,res)=>{
    const product = await Product.findById(req.params.id).populate('category');

    if (!product){
        res.status(500).json({
            success: false
        });
    }
    res.send(product);
})



// Get featured products
router.get(`/get/featured`, async (req,res)=>{
    const products = await Product.find({isFeatured: true})

    if(!products){
        res.status(500).json({success: false})
    }
    res.send(products);
})

// Get products count
router.get(`/get/count`, async (req,res)=>{
    Product.countDocuments().then(count =>{
        if (count){
            return res.status(200).json({productCount: count});
        }else{
            return res.status(500).json({success: false});
        }
    }).catch(err =>{
        return req.status(400).json({
            success: false,
            error: err
        })
    });
})



//Post a new product with optional single image
router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category')

        const file = req.file;
        if (!file) {
            return res.status(400).send('No image in the request')
        }
     
    
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        sex: req.body.sex,
        image: `${basePath}${fileName}`,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        isFeatured: req.body.isFeatured,
        rating: req.body.rating,
        color: req.body.color,
        discount: req.body.discount,
        factoryCode: req.body.factoryCode,
    })

    product = await product.save();

    if (!product){
        return res.status(500).send('Product could not be created');
    }

        res.send(product)
        console.log(product);
})


// Put data in specific product
router.put('/:id', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    //Category test
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid category');

    //Product test
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid product');

    //File exists check
    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    } 

    // const variants = Promise.all(
    //     req.body.variants.map(async (variant) => {
    //         let newVariant = new ProductVariant({
    //             product: variant.product,
    //             color: variant.color,
    //             size: variant.size,
    //             inventory: variant.inventory
    //         });
    //         newVariant = await newVariant.save();
    //         return newVariant._id;
    //     })
    // );
    // const newVariantsResolved = await variants; 

   

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            sex: req.body.sex,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            isFeatured: req.body.isFeatured,
            rating: req.body.rating,
            color: req.body.color,
            discount: req.body.discount,
            factoryCode: req.body.factoryCode,
        },{
            new: true
        }
    )

    if (!updatedProduct)
        return res.status(400).send('the product cannot be updated');

    res.send(updatedProduct);
})

// (WIP) Add variant
router.put('/:id/add/variant', uploadOptions.single('image'), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    //Category test
    // const category = await Category.findById(req.body.category);
    // if (!category) return res.status(400).send('Invalid category');

    //Product test
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send('Invalid product');

    //File exists check
    const file = req.file;
    let imagepath;

    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }
        const variants = Promise.all(
            req.body.variants.map(async (variant) => {
                let newVariant = new ProductVariant({
                    product: variant.product,
                    color: variant.color,
                    size: variant.size,
                    inventory: variant.inventory
                });
                newVariant = await newVariant.save();
                return newVariant._id;
            })
        );
        const newVariantsResolved = await variants; 

     
    const updatedProdWithVariant = await Product.findByIdAndUpdate(
        req.params.id, {
            image: imagepath,
            variants: newVariantsResolved,
        },{
            new: true
        }
    )

    if (!updatedProdWithVariant)
        return res.status(400).send('the product cannot be updated');

    res.send(updatedProdWithVariant);
})

// (WIP) Add gallery
router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    const files = req.files
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (files) {
        files.map(file => {
            imagesPaths.push(`${basePath}${file.filename}`)
        })
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id, {
            images: imagesPaths
        }, {
            new: true
        }
    )

    if (!product)
        return res.status(400).send('the product cannot be updated');

    res.send(product);

})

//Delete specific product
router.delete('/:id', (req,res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product){
            return res.status(200).json({
                success: true,
                message:'product deleted'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'product cannot be deleted'
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