import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateInteriorReqBody } from './interior.request'
import interiorService from './interior.services'
import { INTERIOR_MESSAGES } from './interior.messages'
import interiorImageServices from '../interior_images/interior_image.services'

export const createInteriorController = async (
  req: Request<ParamsDictionary, any, CreateInteriorReqBody>,
  res: Response
) => {
  const result = await interiorService.createInterior(req.body)

  res.json({
    message: INTERIOR_MESSAGES.CREATE_INTERIOR_SUCCESS,
    interior_id: result.insertedId
  })
}

export const getInteriorById = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await interiorService.getInteriorById(id)
  res.json({
    message: INTERIOR_MESSAGES.GET_INTERRIOR_SUCCESS,
    interior: result
  })
}

export const getListInterior = async (req: Request, res: Response) => {
  const result = await interiorService.getListInterior()
  //giờ chúng ta sẽ xử lý result thành 1 mảng mới chia làm 3 mảng con là bán chạy, mới về
  //đầu tiên là bán chạy phải sort theo số lượng bán giảm dần và lấy 20 phần tử đầu
  const bestSellers = result.sort((a, b) => parseInt(b.number_of_sale) - parseInt(a.number_of_sale)).slice(0, 20)
  const newInteriors = result.filter((item) => {
    return item.number_of_sale === '0'
  })
  //sau đó trả về client
  res.json({
    message: INTERIOR_MESSAGES.GET_LIST_INTERIOR_SUCCESS,
    list_interior: {
      best_seller: bestSellers,
      new_interiors: newInteriors
    }
  })
}
