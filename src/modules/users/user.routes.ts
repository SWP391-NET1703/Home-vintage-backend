import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import {
  emailVerifyTokenController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from './user.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
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
  Des: Resend email verify token
  Method: POST
  Path: users/resend-verify-email
  Headers: { Authorization: "Bearer <access_token>" } (đăng nhập mới được resend)
  Body: {}
*/
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
  Des: get profile của user
  Path: '/me'
  Method: get
  Header: {Authorization: Bearer <access_token>}
  Body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getProfileController))

/*
  Des: khi user quên mật khẩu, họ gửi email lên server để xin tạo cho họ forgot_password_token
  Path: /users/forgot-password
  Method: POST
  Body: { email: string }
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
  Des: khi user nhấn vào link trong email để reset password
  Họ sẽ gửi 1 req kèm theo forgot_password_token lên server
  server sẽ kiểm tra forgot_password_token có hợp lệ không? nếu hợp lệ thì sẽ cho phép user reset password
  sau đó chuyến hướng user đến trang reset password
  Path: /users/verify-forgot-password
  Method: POST
  Body: { forgot_password_token: string }
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

export default usersRouter
