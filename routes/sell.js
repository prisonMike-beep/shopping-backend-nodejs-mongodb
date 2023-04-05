const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Item = mongoose.model('Item');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.post('/item', requireAuth, async (req, res) => {
    const { 
            name, 
            description,
            quantity_initial, 
            quantity_final, 
            price,
            catagory
        } = req.body;

    try {
        const item = new Item({ 
            name, 
            description,
            quantity_initial, 
            quantity_final, 
            price,
            catagory,
            sold_by: req.user._id
        });
        await item.save();

        res.send({ message: 'added', _id: item._id });
    } catch (err) {
        console.log(err)
        return res.status(401).send({ error: err})
    }
});

router.get('/item', requireAuth, async (req, res) => {
    try {
        const items = await Item.find({sold_by: req.user._id}).sort({date: 1});
        return res.send(items);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

router.get('/item/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    try {
        const item = await Item.findOne({_id:id})
        return res.send(item);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

module.exports = router;
