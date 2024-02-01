import { Router } from 'express'
import { createInteriorController } from './interior.controllers'
import { createInteriorValidator } from './interior.middlewares'
import { accessTokenAdminValidator } from '../users/user.middlewares'

const interiorRouter = Router()

interiorRouter.post('/create-interior', accessTokenAdminValidator, createInteriorValidator, createInteriorController)

export default interiorRouter
