require('dotenv').config()
require('express-async-errors')

const conn = require('./db/conn')

const auth = require('./middleware/authentication')
const errorHandler = require('./middleware/error-handler')
const notfound = require('./middleware/not-found')

const auth_R = require('./routes/auth_R')
const fcs_R = require('./routes/fcs_R')

const express = require('express')
const app = express()

app.use(express.json())


const PORT = process.env.PORT || 3001

app.get('/', (req, res)=>{

    res.send('Fee Configuration Spec')

})

app.use('/api/v1/auth', auth_R)
app.use('/api/v1/fcs', fcs_R)


app.use(errorHandler)
app.use(notfound)

conn()

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})