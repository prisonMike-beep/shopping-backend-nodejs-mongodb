const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Order = mongoose.model('Order');
const Item = mongoose.model('Item');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.post('/order', requireAuth, async (req, res) => {
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

        const quantity_f = item.quantity_final - quantity
        await Item.findOneAndUpdate({_id: item_id},
            {quantity_final: quantity_f},
            null
            )

        const order = new Order({ 
            item_id,
            quantity,
            price: item.price,
            added_by: req.user._id
        });

        await order.save();

        res.send({ message: 'added', _id: order._id });
    } catch (err) {
        console.log(err)
        return res.status(401).send({ error: "error occured"})
    }
});

router.get('/order', requireAuth, async (req, res) => {
    try {
        const orders = await Order.find({added_by: req.user._id}).sort({date: 1});
        return res.send(orders);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

router.get('/order/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    try {
        const order = await Order.findOne({_id:id})
        return res.send(order);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

module.exports = router;
