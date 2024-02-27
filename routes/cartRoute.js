const express = require('express');
const router = express.Router();
const { Shoe } = require('../models/shoe');
const { Accessorie } = require('../models/accessorie');





router.get('/', async (req, res) => {
    let isAuth = req.session.user ? true : false; 
    try {
        res.render('cart/cart', {isAuth});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on GET request /cart');
    }
});

router.post('/', async (req, res) => { 
    try {
        const cartShoes = req.body.cartShoes || '{}';
        const cartAccessories = req.body.cartAccessories || '{}';

        const shoeIds = Object.keys(cartShoes);
        const accessorieIds = Object.keys(cartAccessories);
        const shoes = await Shoe.find({
            '_id': { $in: shoeIds }
        });

        const accessories = await Accessorie.find({
            '_id': { $in: accessorieIds }
        });

        const cartItems = shoes.concat(accessories);
        res.send(cartItems);
    } catch (error) {
        console.error('Error on POST request /cart', error);
        res.status(500).send('Error on POST request /cart');
    }
});



module.exports = router;