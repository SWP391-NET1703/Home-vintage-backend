import { UserVerifyStatus, UserRole } from './user.enum'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userServices from './user.services'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, TokenPayload } from './User.request'
import { USERS_MESSAGES } from './user.message'
import User from './user.schema'
import { ObjectId } from 'mongodb'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userServices.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const { verify_status, role } = user
  const result = await userServices.login({
    user_id: user_id.toString(),
    verify_status: verify_status as UserVerifyStatus,
    role: role as UserRole
    //verify: user.verify làm như này ăn bug, do tay cho verify là optional
  })
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const result = await userServices.logout(refresh_token)
  res.json(result)
}

export const getProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userServices.getMe(user_id)
  res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result
  })
}
