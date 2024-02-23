import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import {
  emailVerifyTokenController,
  getProfileController,
  loginController,
  logoutController,
  registerController
} from './user.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from './user.middlewares'

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
  Description: Verify email
  Khi user register,  they will receive an email with a format like this:
  https://localhost:3000/users/verify-email?token=<email_verify_token>
  nếu user click vào link này thì sẽ tạo ra req gửi email_verify_token lên server
  server kiểm tra email_verify_token có hợp lệ không? nếu hợp lệ thì sẽ update email_verified thành true
  và vào user_id để update email_verified thành '', verify = 1, update_at = new Date()
  Path: /verify-email
  Method: POST
  Body: { email_verify_token: string }
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))

/*
  Des: get profile của user
  Path: '/me'
  Method: get
  Header: {Authorization: Bearer <access_token>}
  Body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getProfileController))

export default usersRouter
