import { Router } from 'express'
import {
  createInteriorController,
  disableInteriorController,
  getInteriorById,
  getListInterior,
  getListInteriorBestSeller
} from './interior.controllers'
import { createInteriorValidator, disableInteriorValidator } from './interior.middlewares'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'

const interiorRouter = Router()

interiorRouter.post(
  '/create-interior',
  // accessTokenAdminValidator,
  createInteriorValidator,
  wrapAsync(createInteriorController)
)

interiorRouter.get('/', wrapAsync(getListInterior))

interiorRouter.get('/best-seller', wrapAsync(getListInteriorBestSeller))

interiorRouter.get('/:id', wrapAsync(getInteriorById))

interiorRouter.delete(
  '/disable/:id',
  accessTokenAdminValidator,
  disableInteriorValidator,
  wrapAsync(disableInteriorController)
)
export default interiorRouter
