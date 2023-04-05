const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Cart = mongoose.model('Cart');
const Item = mongoose.model('Item');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.post('/cart', requireAuth, async (req, res) => {
    const { 
            item_id, 
            quantity
        } = req.body;

    try {
        const item = await Item.findOne({_id:item_id})

        if(item.quantity_final == 0) {
            return res.send({message: "item out of stock"})
        }

        if(item.quantity_final - quantity < 0) {
            return res.send({message: 'not enough items in stock'})
        }

        const cart = new Cart({ 
            item_id,
            quantity,
            price: item.price,
            added_by: req.user._id
        });

        await cart.save();

        res.send({ message: 'added', _id: cart._id });
    } catch (err) {
        console.log(err)
        return res.status(401).send({ error: "error occured"})
    }
});

router.get('/cart', requireAuth, async (req, res) => {
    try {
        const carts = await Cart.find({added_by: req.user._id}).sort({date: 1});
        return res.send(carts);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

router.get('/cart/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    try {
        const cart = await Cart.findOne({_id:id})
        return res.send(cart);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

module.exports = router;
