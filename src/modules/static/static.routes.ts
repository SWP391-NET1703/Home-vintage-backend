import { wrapAsync } from './../../utils/handlers'
import { Router } from 'express'
import { serveImageController } from './static.controllers'

const staticRouter = Router()
staticRouter.get('/images/:fileName', wrapAsync(serveImageController))

export default staticRouter
