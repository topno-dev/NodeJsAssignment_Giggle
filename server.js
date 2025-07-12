const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render("index")
})

const feature_router = require('./src/routes/apis')

app.use('',feature_router)

app.listen(port)