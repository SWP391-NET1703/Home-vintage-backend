import { wrapAsync } from './../../utils/handlers'
import { Router } from 'express'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { uploadImageController, uploadImageThumbnailController } from './interior_image.controllers'
import { uploadImageThumbnailValidator, uploadImageValidator } from './interior_image.middlewares'

const interiorImageRouter = Router()
/**
 * body : images
 * url : /upload-thumbnail
 * headers : accessToken
 * query : id
 * description : upload thumbnail image
 */
interiorImageRouter.post(
  '/upload-thumbnail',
  // accessTokenAdminValidator,
  uploadImageThumbnailValidator,
  wrapAsync(uploadImageThumbnailController)
)

interiorImageRouter.post(
  '/upload-image',
  // accessTokenAdminValidator,
  uploadImageValidator,
  wrapAsync(uploadImageController)
)

export default interiorImageRouter
