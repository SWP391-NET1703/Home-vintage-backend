import { initFolder } from './utils/file'
import express from 'express'
import { config } from 'dotenv'

import databaseService from './modules/database/database.services'
import { defaultErrorHandler } from './modules/errors/error.middlewares'
import usersRouter from './modules/users/user.routes'
import categoryRouter from './modules/categorys/category.routes'
import interiorRouter from './modules/interiors/interior.routes'
import interiorImageRouter from './modules/interior_images/interior_image.routes'
import argv from 'minimist'
import staticRouter from './modules/static/static.routes'

const options = argv(process.argv.slice(2))
console.log(options.production)

config()

initFolder()
const port = process.env.PORT || 4000
const app = express()

//app handler
app.use(express.json())

app.get('/', (req, res) => {
  res.send(`hello`)
})
databaseService.connect()
app.use('/users', usersRouter)
app.use('/interiors', interiorRouter)
app.use('/categories', categoryRouter)
app.use('/interior-images', interiorImageRouter)
app.use('/static', staticRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`server này đang chạy trên post ${port}`)
})
