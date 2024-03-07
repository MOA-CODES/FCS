require('dotenv').config()
require('express-async-errors')

//docs
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const path = require('path')
const swaggerPath = path.resolve(__dirname, './swagger.yaml')
const swaggerDoc = YAML.load(swaggerPath)
const swaggerCss = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css"

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

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc,{customCssUrl:swaggerCss}))
app.get('/', (req, res)=>{
    res.send('<center>\
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"\
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"crossorigin="anonymous" />\
    <h1>FCS API</h1><p>This is a Backend API to create Fee Configuration Specs, get Fee Configuration Specs and compute transaction fees, if a transaction fits an available Fee Configuration Spec</p>\
    <p>There is no front-end currently for the app, its a purely a backend app.</p>\
    <p></p>\
    <p>At the end of this websites URL attach:</p>\
    <li>/api/v1/fcs for fcs routes.</li>\
    <p></p>\
    <p><i><u><a href="/api-docs">for more detailed documentation click here</a></i></u></p>\
    <p></p>\
    <p></p>\
    <h3><p><b>Made by <i><a href="https://github.com/MOA-CODES">MOA-CODES</a></i></b></P></h3>\
    </center>')
})

app.use('/api/v1/auth', auth_R)
app.use('/api/v1/fcs', fcs_R)


app.use(errorHandler)
app.use(notfound)

conn()

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})