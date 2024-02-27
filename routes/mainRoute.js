const express = require('express');
const router = express.Router();
const {CAT_API_KEY, CURRENCY_API_KEY} = require('../config/api')

router.get('/', async (req, res) => {
    res.redirect('/main');
});

router.get('/main', async (req, res) => { 
        res.render('main');
});

router.get('/sign', async (req, res) => {
    res.render('sign/sign');
});

router.get('/cat', async (req, res) => {
    try {
        const factResponse = await fetch(`https://catfact.ninja/fact?apikey=${CAT_API_KEY}`);
        if (!factResponse) {
            return res.status(400).send('Cats error');
        }
        const factData = await factResponse.json();
        const imageResponse = await fetch(`https://api.thecatapi.com/v1/images/search?apikey=${CAT_API_KEY}`);
        if (!imageResponse) {
            return res.status(400).send('Cats image error');
        }
        const imageData = await imageResponse.json();
        let cat = {
            fact: factData,
            image: imageData
        }
        res.send(cat);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on GET request /cat');
    }
}); 


router.get('/currency', async (req, res) => {
    try {
        const currencyResponse = await fetch(`https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}`);
        if (!currencyResponse) {
            return res.status(400).send('Currency error');
        }
        const currencyJson = await currencyResponse.json();
        res.send(currencyJson);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error on GET request /currency');
    }
});





module.exports = router;