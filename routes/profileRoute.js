const express = require('express');
const router = express.Router();
const { User } = require('../models/user')
const { Shoe } = require('../models/shoe')
const { Accessorie } = require('../models/accessorie');
const bcrypt = require('bcryptjs');
const { checkAuthenticated, checkAdmin } = require('../middleware/authHandler');




router.get(`/`, async (req, res) => {
    try {
        if (req.session.user) {
            const fullUrl = req.protocol + '://' + req.get('host');
            let user = await fetch(`${fullUrl}/profile/id/${req.session.user.id}`, {method: "GET"})
            if (user) {
                user = await user.json();
                res.render('profile/profile', {user: user});
            } else {
                return res.status(400).send('Error entering profile page 1');
            }
        } else {
            res.render('sign/sign');
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error entering profile page');
    }
})


router.post(`/register`, async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            // isAdmin: req.body.isAdmin
        });
        
        if(!user) {
            return res.status(400).send('User cannot be created');
        }

        user = await user.save();

        res.status(200).send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error while register');
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        
        if (!user) {
            return res.status(400).send('The user not found');
        }
        
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.passwordHash);
        
        if (!isPasswordCorrect) {
            return res.status(400).send('Password is wrong!');
        }
        
        req.session.user = { id: user.id, isAdmin: user.isAdmin };
        
        await User.findByIdAndUpdate(user.id, { lastLogged: Date.now() });

        res.status(200).send({ isAdmin: user.isAdmin });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error while log in');
    }
});

router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            return console.error(err);
        }
        res.render('main');
    });

});

router.put(`/update-user/:id`,checkAuthenticated, async (req, res) => {

    let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(400).send('User not found');
        }
    
    user.name = req.body.name
    user.email = req.body.email
    if (req.body.password !== '')
    user.passwordHash = bcrypt.hashSync(req.body.password, 10)

    user = await user.save();

    return res.status(200).send(user);
});


router.get(`/get/count`, checkAuthenticated, async (req,res) => {
    const userCount = await User.countDocuments();
    
    if(!userCount) {
        res.status(500).json({success: false});
    }
    res.send({
        count: userCount
    });
});

router.get(`/id/:id`, async (req,res) => {
    try {
        const userList = await User.findById(req.params.id).select("-passwordHash");
        if(!userList) {
            res.status(500).json({success: false});
        }

        res.send(userList);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error getting user data');
    }
});

router.get(`/get/email/:email`, async (req,res) => {
    const userList = await User.find({email: req.params.email});
    if(!userList || userList.length === 0) {
        return res.status(422).json({ success: false});
    } else {
        return res.status(200).send(userList);
    }
});



router.post('/check-password/:id',checkAuthenticated, async (req,res) => {
    const user = await User.findById(req.params.id);
    
    if (!user || !req.body.password) {
        return res.status(400).send('The user not found or wrong password');
    }
    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
        return res.status(200).send({password: req.body.password});
    } else {
        return res.status(400).send('Password is wrong!');
    }
});

router.get('/admin',checkAdmin, async (req, res) => {
    let lang = req.query.lang || 'en'
    res.redirect(`/profile/admin/users?lang=${lang}`);
});

router.get('/admin/users',checkAdmin, async (req, res) => {
    try {
        let userList = await User.find().select('-passwordHash'); 
        if(!userList) {
            return res.status(400).send('Users not found');
        }
        res.render(`profile/admin-users`, { users: userList });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Error getting all users data');
    }
});

router.put(`/admin/users/:id`,checkAdmin, async (req, res) => {

    let user = await User.findById(req.params.id);
        if(!user) {
            return res.status(400).send('User not found');
        }
    
    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    user.updatedAt = Date.now();

    user = await user.save();

    return res.status(200).send(user);
});


router.post(`/admin/users`,checkAdmin, async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin
    });
    
    if(!user) {
        return res.status(400).send('User cannot be created');
    }

    user = await user.save();

    res.status(200).send(user);
});


router.delete('/admin/users/:id',checkAdmin, async (req, res) => {
    let user = await User.findByIdAndDelete(req.params.id);

    if (user) {
        return res.status(200).json({ success: true, message: "User is deleted" });
    } else {
        return res.status(404).json({ success: false, message: "User not found" });
    }
});

router.get('/admin/products',checkAdmin, async (req, res) => {
    try {
        let list;
        let type = req.query.type || 'shoes'
        if (type == "shoes") {
            list = await Shoe.find();
        } else if (type == "accessories") {
            list = await Accessorie.find();
        }

        if(!list) {
            return res.status(400).send('Products not found');
        } 
        res.render('profile/admin-products', { products: list, type: type });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Error getting all products data');
    }
});

router.put(`/admin/products/:id`,checkAdmin, async (req, res) => {
    try {
        let list;
        let type = req.query.type || 'shoes'
        if (type == "shoes") {
            list = await Shoe.findById(req.params.id);
        } else if (type == "accessories") {
            list = await Accessorie.findById(req.params.id);
        }
        
        if(!list) {
            return res.status(400).send('Products not found');
        }
        let {name, productType, collectionName, price, color, image, isFeatured, inStock} = req.body
        list.name = name;
        list.productType = productType;
        list.collectionName = collectionName;
        list.price = price;
        list.color = color;
        list.image = image;
        list.isFeatured = isFeatured;
        list.inStock = inStock;
        list.updatedAt = Date.now();

        list = await list.save();

        return res.status(200).send(list);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error PUT products data');
    }
});


router.post(`/admin/products`,checkAdmin, async (req, res) => {
    try {
        let list;
        let type = req.query.type || 'shoes'
        let {name, productType, collectionName, price, color, image, isFeatured, inStock} = req.body
        if (type == "shoes") {
            list = new Shoe({
                name,
                productType,
                collectionName,
                price,
                color,
                image,
                isFeatured,
                inStock
            })
        } else if (type == "accessories") {
            list = new Accessorie({
                name,
                productType,
                collectionName,
                price,
                color,
                image,
                isFeatured,
                inStock
            })
        }
        
        
        if(!list) {
            return res.status(400).send('Product cannot be created');
        }

        list = await list.save();

        res.status(200).send(list);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error POST products data');
    }
});


router.delete('/admin/products/:id',checkAdmin, async (req, res) => {
    try {
        let list;
        let type = req.query.type || 'shoes'
        if (type == "shoes") {
            list = await Shoe.findByIdAndDelete(req.params.id);
        } else if (type == "accessories") { 
            list = await Accessorie.findByIdAndDelete(req.params.id);
        }
        if (list) {
            return res.status(200).json({ success: true, message: "Product is deleted" });
        } else {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error deleting products data');
    }
});

module.exports = router;