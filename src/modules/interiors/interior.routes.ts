import { Router } from 'express'
import { createInteriorController } from './interior.controllers'
import { createInteriorValidator } from './interior.middlewares'

const interiorRouter = Router()

interiorRouter.post('/create-interior', createInteriorValidator, createInteriorController)

export default interiorRouter
