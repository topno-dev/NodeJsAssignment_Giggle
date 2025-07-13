const express = require('express')
const app = express()
const port = 3000
const path = require('path')

app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render("index")
})

const feature_router = require('./src/routes/apis')

app.use('',feature_router)
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')))
app.use('/scripts', express.static(path.join(__dirname, 'src/js')))
app.use('/styles', express.static(path.join(__dirname, 'src/css')))

console.log(`
         ,MMM8&&&.
    _...MMMMM88&&&&..._
 .::'''MMMMM88&&&&&&'''::.
::     MMMMM88&&&&&&     ::
'::....MMMMM88&&&&&&....::'
   \`''''MMMMM88&&&&''''\`
   jgs   'MMM8&&&'
`)

app.listen(port)
