const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Endpoints get Route example')
})

module.exports = router;