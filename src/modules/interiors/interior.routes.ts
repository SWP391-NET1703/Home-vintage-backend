import { Router } from 'express'
import {
  createInteriorController,
  disableInteriorController,
  getInteriorById,
  getListInterior,
  getListInteriorBestSeller,
  updateInteriorController
} from './interior.controllers'
import { createInteriorValidator, disableInteriorValidator, updateInteriorValidator } from './interior.middlewares'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { filterMiddleware } from '~/utils/common'
import { UpdateInteriorReqBody } from './interior.request'

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

interiorRouter.patch(
  '/:id',
  accessTokenAdminValidator,
  filterMiddleware<UpdateInteriorReqBody>([
    'interior_name',
    'category_id',
    'description',
    'color',
    'material',
    'price',
    'quantity',
    'size',
    'thumbnail',
    'images'
  ]),
  updateInteriorValidator,
  wrapAsync(updateInteriorController)
)
export default interiorRouter
