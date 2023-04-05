const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    added_date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Cart', cartSchema);
