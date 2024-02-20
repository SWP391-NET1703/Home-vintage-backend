import { wrapAsync } from '~/utils/handlers'
import { Router } from 'express'
import {
  createInteriorController,
  deleteInteriorController,
  getInteriorById,
  updateInteriorController
} from './interior.controllers'
import { createInteriorValidator, idInteriorValidator, updateInteriorValidator } from './interior.middlewares'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { filterMiddleware } from '~/utils/common.middlewares'
import { UpdateInteriorBody } from './interior.request'

const interiorRouter = Router()

interiorRouter.post(
  '/create-interior',
  accessTokenAdminValidator,
  createInteriorValidator,
  wrapAsync(createInteriorController)
)

interiorRouter.patch(
  '/:id',
  accessTokenAdminValidator,
  idInteriorValidator,
  updateInteriorValidator,
  filterMiddleware<UpdateInteriorBody>([
    'interior_name',
    'category_id',
    'description',
    'quantity',
    'price',
    'material',
    'size',
    'color',
    'warranty',
    'status'
  ]),
  wrapAsync(updateInteriorController)
)

interiorRouter.delete('/:id', accessTokenAdminValidator, idInteriorValidator, wrapAsync(deleteInteriorController))

interiorRouter.get('/:id', wrapAsync(getInteriorById))
export default interiorRouter
