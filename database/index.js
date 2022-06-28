const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test_db')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => dbDebugger.error('Could not connect to MongoDB...', err))

module.exports = { mongoose }