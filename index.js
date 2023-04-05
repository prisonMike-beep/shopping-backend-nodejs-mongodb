require('./models/User')
require('./models/Item')
require('./models/Order')
require('./models/Cart')

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const buyRoutes = require('./routes/buy');
const sellRoutes = require('./routes/sell');
const cartRoutes = require('./routes/cart');
const requireAuth = require('./middleware/requireAuth');

const app = express()

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(authRoutes)
app.use(buyRoutes)
app.use(sellRoutes)
app.use(cartRoutes)

dotenv.config();

const dbUrl = process.env.DB_CONNECT;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.get('/', requireAuth, (req, res) => {
    try {
        res.send(`Your email: ${req.user.email}`);
    } catch(err) {
        res.send("access denied")
    }
})

//port
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
