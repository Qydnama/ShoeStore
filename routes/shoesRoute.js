const express = require('express');
const router = express.Router();
const { Shoe } = require('../models/shoe');
const { checkAdmin } = require('../middleware/authHandler');




router.get('/', async (req, res) => { 
    try {
        let shoesList = await Shoe.find({isFeatured: true})
        if(!shoesList) {
            return res.status(400).send('Shoes not found');
        }
        res.render('shoes/shoes', { shoes: shoesList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on GET request /shoes');
    }
});

// ADD CHECK ADMIN!!!!
router.post(`/`, checkAdmin, async (req, res) => {
    const { name, productType, collectionName, color,image, price, isFeatured, inStock } = req.body;
    let shoe = new Shoe({
        name: {
            en: name.en,
            ru: name.ru,
        },
        productType: {
            en: productType.en,
            ru: productType.ru
        },
        collectionName: collectionName,
        image: image,
        price: price,
        color: color,
        isFeatured: isFeatured,
        inStock: inStock
    });
    
    if(!shoe) {
        return res.status(400).send('Shoe cannot be created');
    }

    shoe = await shoe.save();

    res.status(200).send(shoe);
});




module.exports = router;