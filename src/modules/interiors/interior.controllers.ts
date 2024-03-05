import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateInteriorReqBody } from './interior.request'
import interiorService from './interior.services'
import { INTERIOR_MESSAGES } from './interior.messages'
import interiorImageServices from '../interior_images/interior_image.services'
import customerReportService from '../customer-report/customer-report/customer-report.services'

export const createInteriorController = async (
  req: Request<ParamsDictionary, any, CreateInteriorReqBody>,
  res: Response
) => {
  const result = await interiorService.createInterior(req.body)

  res.json({
    message: INTERIOR_MESSAGES.CREATE_INTERIOR_SUCCESS,
    result
  })
}

export const getInteriorById = async (req: Request, res: Response) => {
  const { id } = req.params
  const interior = await interiorService.getInteriorById(id)
  const listReport = await customerReportService.getListCustomerReportNotCheckAndValidByInteriorId(id)
  if (interior) interior.list_report = listReport
  res.json({
    message: INTERIOR_MESSAGES.GET_INTERRIOR_SUCCESS,
    interior: interior
  })
}

export const getListInterior = async (req: Request, res: Response) => {
  const listInterior = await interiorService.getListInterior()
  for (let index = 0; index < listInterior.length; index++) {
    const listReport = await customerReportService.getListCustomerReportNotCheckAndValidByInteriorId(
      listInterior[index]._id?.toString() as string
    )
    listInterior[index].list_report = listReport ? listReport : []
  }
  //giờ chúng ta sẽ xử lý result thành 1 mảng mới chia làm 3 mảng con là bán chạy, mới về
  //đầu tiên là bán chạy phải sort theo số lượng bán giảm dần và lấy 20 phần tử đầu
  const bestSellers = listInterior
    .sort((interior_a, interior_b) => parseInt(interior_b.number_of_sale) - parseInt(interior_a.number_of_sale))
    .slice(0, 20)
  const newInteriors = listInterior.filter((interior) => {
    return interior.number_of_sale === '0'
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
