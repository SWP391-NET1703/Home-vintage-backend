import express from 'express'
import SwaggerUI from 'swagger-ui'
import databaseService from './modules/database/database.services'
import { defaultErrorHandler } from './modules/errors/error.middlewares'
import usersRouter from './modules/users/user.routes'
import categoryRouter from './modules/categorys/category.routes'
import interiorRouter from './modules/interiors/interior.routes'

const port = process.env.PORT
const app = express()

//app handler
app.use(express.json())

//config
databaseService.connect()

//API Router
app.use('/users', usersRouter)
app.use('/interiors', interiorRouter)
app.use('/categories', categoryRouter)

//Swagger Cofig
// SwaggerUI({
//   dom_id: '#myDomId'
// })
// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`server này đang chạy trên post ${port}`)
})
