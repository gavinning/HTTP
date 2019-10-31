const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('/api/user', (req, res) => {
    res.send({
        code: 0,
        message: 'ok',
        data: {
            id: 1,
            name: 'gavinning',
            foo: req.query.foo
        }
    })
})

app.post('/api/user', (req, res) => {
    res.send({
        code: 0,
        message: 'ok',
        data: {
            id: 1,
            name: 'gavinning',
            foo: req.body.foo
        }
    })
})

module.exports = app

