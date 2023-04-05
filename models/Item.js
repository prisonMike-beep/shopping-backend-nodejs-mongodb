const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    quantity_initial: {
        type: Number,
        required: true
    },
    quantity_final: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    catagory: {
        type: String,
        required: true
    },
    sold_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    added_date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('Item', itemSchema);
