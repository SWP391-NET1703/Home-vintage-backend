import { wrapAsync } from '../../utils/handlers'
import { accessTokenAdminValidator, accessTokenValidator } from '../users/user.middlewares'
import { Router } from 'express'
import { createCategoryController } from './category.controller'
import { createCategoryValidator } from './category.middlewares'

const categoryRouter = Router()

categoryRouter.post(
  '/new-category',
  accessTokenAdminValidator,
  createCategoryValidator,
  wrapAsync(createCategoryController)
)

export default categoryRouter
