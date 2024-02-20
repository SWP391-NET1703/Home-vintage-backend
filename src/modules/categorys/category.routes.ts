import { wrapAsync } from '../../utils/handlers'
import { accessTokenAdminValidator, accessTokenValidator } from '../users/user.middlewares'
import { Router } from 'express'
import { createCategoryController, getListCategoryController, updateCategoryController } from './category.controller'
import { createCategoryValidator, updateCategoryValidator } from './category.middlewares'

const categoryRouter = Router()

categoryRouter.post(
  '/new-category',
  accessTokenAdminValidator,
  createCategoryValidator,
  wrapAsync(createCategoryController)
)

categoryRouter.get('/', wrapAsync(getListCategoryController))

categoryRouter.patch(
  '/update-category',
  accessTokenValidator,
  updateCategoryValidator,
  wrapAsync(updateCategoryController)
)

export default categoryRouter
