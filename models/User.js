const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre('save', function(next) { //using keyword function lets use use this
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if(err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }

            user.password = hash;
            next();
        })
    })
});

userSchema.methods.encryptPassword = function(candidatePasswrod) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if(err) {
                return reject(err);
            }
    
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) {
                    return reject(err);
                }
    
                user.password = hash;
                resolve(true);
            })
        })
    })
}

userSchema.methods.comparePassword = function(candidatePasswrod) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePasswrod, user.password, (err, isMatch) => {
            if(err) {
                return reject(err);
            }
            if(!isMatch) {
                return reject(false);
            }

            resolve(true);
        })
    })
}

mongoose.model('User', userSchema);
