const next = require("next")
const express = require("express")
const endpoints = require('./routes/endpoints-template')
require('../database/index')

const dev = process.env.NODE_ENV !== "production"
const app = next({dev})
const handle = app.getRequestHandler()
const { parse } = require("url")

app.prepare().then(() => {
    const server = express()
    server.use(express.json())
    server.use('/api/endpoints-template', endpoints)

    server.get('*', (req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
    })

    server.listen(process.env.PORT || 3000, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`)
    })
})