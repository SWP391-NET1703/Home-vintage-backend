import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import { getProfileController, loginController, logoutController, registerController } from './user.controllers'
import { accessTokenValidator, loginValidator, refreshTokenValidator, registerValidator } from './user.middlewares'

const usersRouter = Router()

/*
  Description: Register new user
  Path: /register
  Method: POST
  Body: { ... }
*/
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
  Description: Login
  Path: /login
  Method: POST
  Body: { email, password }
    - email: string
    - password: string
*/
usersRouter.post('/login', loginValidator, wrapAsync(loginController))

/*
  Description: Logout
  Path: /logout
  Method: POST
  Headers: { Authorization: 'Bearer <access_token>' }
  Body: { refresh_token: string }
*/
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
  Des: get profile của user
  Path: '/me'
  Method: get
  Header: {Authorization: Bearer <access_token>}
  Body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getProfileController))

export default usersRouter
