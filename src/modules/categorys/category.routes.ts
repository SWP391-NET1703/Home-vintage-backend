import { wrapAsync } from '../../utils/handlers'
import { accessTokenAdminValidator, accessTokenValidator } from '../users/user.middlewares'
import { Router } from 'express'
import { createCategoryController, getListCategoryController } from './category.controller'
import { createCategoryValidator } from './category.middlewares'

const categoryRouter = Router()

categoryRouter.post(
  '/new-category',
  accessTokenAdminValidator,
  createCategoryValidator,
  wrapAsync(createCategoryController)
)

categoryRouter.get('/get-list-category', accessTokenValidator, wrapAsync(getListCategoryController))

export default categoryRouter
