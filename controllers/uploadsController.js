const Product = require('../models/Product');
const { Statuscodes } = require('http-status-codes');
const path = require('path');

const uploadProductImage = async (req, res) => {
    let productImage = req.files.image;
    const imagePath = path.join(__dirname, '../public/uploads' + `${productImage}`);
    await productImage.mv(imagePath);
    res.send('image product updated successfully');
}
module.exports = {uploadProductImage};