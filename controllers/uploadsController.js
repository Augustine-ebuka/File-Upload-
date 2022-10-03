const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const customError  = require('../errors');
const Cloudinary = require('cloudinary').v2;
const  fs = require('fs');

const uploadProductImageLocal = async (req, res) => {
    let productImage = req.files.image;
    const FILE_SIZE = 3 * 1024 * 1024;
    if (!req.files) {
        throw new customError.BadRequestError('image not found');
    }
    if (!productImage.mimetype.startsWith('image')) {
        throw new customError.BadRequestError('file type is not supported');    
    }
    if (productImage.size > FILE_SIZE) {
        throw new customError.BadRequestError('image size is greater than 3MB');      
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    //.mv() is an important  of the module (file-uploads) that allow you to move an image into your local storage 
    await productImage.mv(imagePath);
   return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}})
 
}

const uploadProductImage = async (req, res) => {

    let productImage = req.files.image;
    const FILE_SIZE = 3 * 1024 * 1024;
    if (!req.files) {
        throw new customError.BadRequestError('image not found');
    }
    if (!productImage.mimetype.startsWith('image')) {
        throw new customError.BadRequestError('file type is not supported');    
    }
    if (productImage.size > FILE_SIZE) {
        throw new customError.BadRequestError('image size is greater than 3MB');      
    }
    //to upload on cloudinary, you two parameters, the path and the name of the folder you created on the cloudinary
    const result = await Cloudinary.uploader.upload(
       productImage.tempFilePath,
        {
            use_temp_files: true,
            folder : 'file-upload',
        });
    fs.unlink(productImage.tempFilePath, function (err) { 
        if (err){
            throw new Error('file couldnt be deleted')
        }
    })
    //fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
}
module.exports = { uploadProductImage };

//checks
//check if image ezist
//check if it mimetype is image
//check if the ssize is greater than 1mb