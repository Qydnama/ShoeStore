const express = require('express');
const router = express.Router();
const { Accessorie } = require('../models/accessorie');
const { checkAdmin } = require('../middleware/authHandler');



router.get('/', async (req, res) => { 
    try {
        let accessoriesList = await Accessorie.find({isFeatured: true})
        if(!accessoriesList) {
            return res.status(400).send('Accessories not found');
        }
        res.render('accessories/accessories', { accessories: accessoriesList });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on GET request /accessories');
    }
});

// ADD CHECK ADMIN!!!!
router.post(`/`, checkAdmin, async (req, res) => {
    try {
        const { name, productType, collectionName,image, color, price, isFeatured, inStock } = req.body;
        let accessorie = new Accessorie({
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

        if(!accessorie) {
            return res.status(400).send('accessorie cannot be created');
        }

        accessorie = await accessorie.save();

        res.status(200).send(accessorie);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on POST request /accessories');
    }
});




module.exports = router;