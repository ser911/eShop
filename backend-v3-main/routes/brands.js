const {Brand} = require('../models/brand');
const express = require ('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

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
    },    
    limits: {fieldsize: 25 * 1024 * 1024}
})

const uploadOptions = multer({
    storage: storage
})

router.get(`/`, async(req,res)=>{
    const brandsList = await Brand.find()

    if(!brandsList){
        res.status(500).json({
            success: false
        });
    }

    res.send(brandsList);
})

router.get(`/:id`, async(req,res)=>{
    const brand = await Brand.findById(req.params.id);

    if(!brand){
        res.status(500).json({
            success: false
        });
    }

    res.send(brand);
})




router.post(`/`, uploadOptions.single('image'), async(req,res)=>{

    const file = req.file;
    if(!file){
        return res.status(400).send('No image in the request')
    }

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


    let brand = new Brand({
        name: req.body.name,
        image: `${basePath}${fileName}`
    })

    brand = await brand.save();

    if(!brand){
        return res.status(500).send('Brand could not be created');
    }

    res.send(brand);
})

router.put(`/:id`, uploadOptions.single('image'), async(req,res)=>{
    const file = req.file;
    let imagepath;
    
    if (file){
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
        imagepath = `${basePath}${fileName}`
    }else{
        imagepath = Brand.image;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,{
            name: req.body.name,
            image: imagepath
        },{new: true}
    )


    if(!updatedBrand){
        return res.status(400).send('the brand cannot be updated')
    }

    res.send(updatedBrand);
})

router.delete(`/:id`, (req,res)=>{
    Brand.findByIdAndRemove(req.params.id).then(brand =>{
        if(brand){
            return res.status(200).json({
                success: true,
                message: 'product deleted'
            });
        }else{
            return res.status(404).json({
                success: false,
                message: 'brand cannot be deleted'
            });
        }
    }).catch(err =>{
        return res.status(400).json({
            succcess: false,
            error: err
        });
    })
})


module.exports = router;