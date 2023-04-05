const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = mongoose.model('User');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    User.findOne({ email: email })
    .then((docs) => {
        if(docs != null) {
            return res.status(403).send({ error: "user already exists" })
        }

        const newUser = new User({ firstname, lastname, email, password });
        newUser.save()
        .then((result) => {
            return res.status(200).send({ message: "user created" })
        })
        .catch ((err) => {
            console.log(err)
            return res.status(403).send({ error: "error occured while creating user" })
        })
    })
    .catch((err) => {
        console.log(err)
        return res.status(403).send({ error: "error occured while creating user" })
    })
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
        res.status(401).send({ message: 'both email and password required'})
    }
    
    const user = await User.findOne({ email: email });
    if(!user) {
        return res.status(403).send({ error: 'user does not exist'})
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign(
            { userId:  user._id },
            process.env.SECURE_KEY
        )

        res.send({ token: token })
    } catch (err) {
        res.status(403).send({ error: 'error'})
    }
});

router.get('/user/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({_id:id}).select("-password")
        return res.send(user);
    } catch (err) {
        console.log(err)
        return res.status(401).send({error: err});
    }
})

module.exports = router;
