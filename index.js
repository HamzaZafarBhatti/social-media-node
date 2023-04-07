const express = require('express');
const app = express(); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const usersRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')

dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
    console.log('Connected')
});

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan())

app.use('/api/users', usersRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postsRoute)

app.listen(8800, () => {
    console.log('listening')
})