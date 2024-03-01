require('dotenv').config()
require('express-async-errors')

const conn = require('./db/conn')
const auth = require('./middleware/authentication')
const errorHandler = require('./middleware/error-handler')
const notfound = require('./middleware/not-found')

const express = require('express')
const app = express()

const PORT = process.env.PORT || 3001

app.get('/', (req, res)=>{

    res.send('Fee Configuration Spec')

})

app.use(express.json())
app.use(errorHandler)
app.use(notfound)

conn()

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})