import { wrapAsync } from './../../utils/handlers'
import { Router } from 'express'
import { deleteImageController, updateImageController, uploadImageController } from './interior_image.controllers'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import {
  deleteImageInteriorValidator,
  idInteriorValidator,
  updateImageInteriorValidator,
  uploadImageInteriorValidator
} from '../interiors/interior.middlewares'

const interiorImageRouter = Router()

interiorImageRouter.post(
  '/upload-interior-image/:id',
  accessTokenAdminValidator,
  uploadImageInteriorValidator,
  wrapAsync(uploadImageController)
)

interiorImageRouter.post(
  '/update-interior-image/:id',
  accessTokenAdminValidator,
  updateImageInteriorValidator,
  wrapAsync(updateImageController)
)

interiorImageRouter.delete(
  '/delete-interior-image/:id',
  accessTokenAdminValidator,
  deleteImageInteriorValidator,
  wrapAsync(deleteImageController)
) //này là delete all nha
export default interiorImageRouter
