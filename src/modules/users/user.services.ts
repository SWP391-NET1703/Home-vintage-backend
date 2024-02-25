import { signToken, verifyToken } from './../../utils/jwt'
import databaseService from '../database/database.services'
import { RegisterReqBody } from './User.request'
import User from './user.schema'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus, TokenType, UserRole } from './user.enum'
import { hashPassword } from '~/utils/crypto'
import RefreshToken from '../refresh_tokens/RefreshToken.schema'
import { USERS_MESSAGES } from './user.message'
import { config } from 'dotenv'

config()

class UserServices {
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  //viết hàm nhận vào user_id để bỏ vào payload tạo access token
  private signAccessToken({
    user_id,
    verify_status,
    role
  }: {
    user_id: string
    verify_status: UserVerifyStatus
    role: UserRole
  }) {
    return signToken({
      //chưa muốn xài nên ko dùng await
      payload: { user_id, token_type: TokenType.AccessToken, verify_status, role },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as string },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })
  }

  //viết hàm nhận vào user_id để bỏ vào payload tạo refresh token
  private signRefreshToken({
    user_id,
    verify_status,
    exp,
    role
  }: {
    user_id: string
    verify_status: UserVerifyStatus
    exp?: number
    role: UserRole
  }) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify_status, exp, role },
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as string },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    } else {
      return signToken({
        payload: { user_id, token_type: TokenType.RefreshToken, verify_status, role },
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as string },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
  }

  //hàm signEmailVerifyToken
  private signEmailVerifyToken({
    user_id,
    verify_status,
    role
  }: {
    user_id: string
    verify_status: UserVerifyStatus
    role: UserRole
  }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken, verify_status, role },
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as string },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
    })
  }

  //hàm signForgotPasswordToken
  private signForgotPasswordToken({
    user_id,
    verify_status,
    role
  }: {
    user_id: string
    verify_status: UserVerifyStatus
    role: UserRole
  }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify_status, role },
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as string },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
    })
  }

  //ký access và refresh
  private signAccessAndRefreshToken({
    user_id,
    verify_status,
    role
  }: {
    user_id: string
    verify_status: UserVerifyStatus
    role: UserRole
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify_status, role }),
      this.signRefreshToken({ user_id, verify_status, role })
    ])
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async checkPhoneNumberExist(phone_number: string) {
    const user = await databaseService.users.findOne({ phone_number })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify_status: UserVerifyStatus.Unverified,
      role: UserRole.User
    })
    const { full_name, email, phone_number, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        _id: user_id,
        email_verify_token,
        full_name,
        email,
        phone_number,
        password: hashPassword(password),
        role: UserRole.User
      })
    )

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify_status: UserVerifyStatus.Unverified,
      role: UserRole.User
    })

    // lưu refresh_token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp: 0,
        iat: 0
      })
    )

    console.log(email_verify_token) //giả lập gửi email verify =))
    return { access_token, refresh_token }
  }

  async login({ user_id, verify_status, role }: { user_id: string; verify_status: UserVerifyStatus; role: UserRole }) {
    //tạo access token và refresh token luôn
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify_status,
      role
    })

    //tạo xong thì lưu vào db
    const { exp, iat } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp,
        iat
      })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          created_at: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async verifyEmail(user_id: string) {
    // update lại user đó
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          verify_status: UserVerifyStatus.Verified,
          email_verify_token: ''
          // update_at: '$$NOW'
        }
      }
    ])

    // tạo ra acess_token và refresh_token
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      verify_status: UserVerifyStatus.Verified,
      role: UserRole.User
    })

    // Lưu refresh_token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id),
        exp: 0,
        iat: 0
      })
    )
    return { access_token, refresh_token }
  }

  async resendEmailVerify(user_id: string) {
    // tạo ra email_verify_token
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify_status: UserVerifyStatus.Verified,
      role: UserRole.User
    })
    // update lại user đó
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token
          // update_at: '$$NOW'
        }
      }
    ])

    // giả lập gửi email verify token
    console.log(email_verify_token)
    return { message: USERS_MESSAGES.RESEND_verify_status_SUCCESS }
  }

  async forgotPassword(user_id: string) {
    // tạo ra forgot_password_token
    const forgot_password_token = await this.signForgotPasswordToken({
      user_id,
      verify_status: UserVerifyStatus.Verified,
      role: UserRole.User
    })
    // update lại user đó
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token
          // updated_at: '$$NOW'
        }
      }
    ])

    // giả lập gửi mail
    console.log(forgot_password_token)
    return { message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    // dựa vào user_id để tìm user và update password
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ''
        }
      }
    ])
    return { message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS }
  }
}

const userServices = new UserServices()
export default userServices
