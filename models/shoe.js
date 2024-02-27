const mongoose = require('mongoose');

const ShoeSchema = new mongoose.Schema({
    name: {
        en: {
            type: String,
            required: true 
        },
        ru: {
            type: String,
            required: true 
        }
    },
    productType: {
        en: {
            type: String,
            required: true 
        },
        ru: {
            type: String,
            required: true 
        }
    },
    collectionName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

exports.Shoe = mongoose.model('Shoe', ShoeSchema);
