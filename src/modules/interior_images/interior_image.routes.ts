import { wrapAsync } from './../../utils/handlers'
import { Router } from 'express'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { uploadImageThumbnailController } from './interior_image.controllers'
import { uploadImageThumbnailValidator } from './interior_image.middlewares'

const interiorImageRouter = Router()

interiorImageRouter.post(
  '/upload-thumbnail/:id',
  //   accessTokenAdminValidator,
  uploadImageThumbnailValidator,
  wrapAsync(uploadImageThumbnailController)
)

export default interiorImageRouter
