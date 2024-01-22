import { ParamsDictionary } from 'express-serve-static-core'
import { CreateCategoryReqBody } from './category.request'
import { Request, Response } from 'express'
import { CATEGORY_MESSAGES } from './category.message'
import categoryServices from './category.services'

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateCategoryReqBody>,
  res: Response
) => {
  const result = await categoryServices.createCategory(req.body)
  res.json({
    message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
    result
  })
}
