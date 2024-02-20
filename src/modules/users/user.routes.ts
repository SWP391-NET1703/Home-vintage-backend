import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import { getProfileController, loginController, logoutController, registerController } from './user.controllers'
import { accessTokenValidator, loginValidator, refreshTokenValidator, registerValidator } from './user.middlewares'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, wrapAsync(registerController))

usersRouter.post('/login', loginValidator, wrapAsync(loginController))

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

usersRouter.get('/me', accessTokenValidator, wrapAsync(getProfileController))

export default usersRouter
