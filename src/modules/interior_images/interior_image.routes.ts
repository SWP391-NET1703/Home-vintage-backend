import { wrapAsync } from './../../utils/handlers'
import { Router } from 'express'
import { uploadImageController } from './interior_image.controllers'
import { accessTokenAdminValidator } from '../users/user.middlewares'

const interiorImageRouter = Router()

interiorImageRouter.post('/upload-interior-image/:id', accessTokenAdminValidator, wrapAsync(uploadImageController))

export default interiorImageRouter
