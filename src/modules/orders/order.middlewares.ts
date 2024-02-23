import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorService from '../interiors/interior.services'
import { OrderDetail } from './order.schema'
import { ObjectId } from 'mongodb'
import { ORDER_MESSAGES } from './order.messages'

export const createOrderValidator = validate(
  checkSchema(
    {
      'detail.*.interior_id': {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: 'Id is not valid'
        },
        custom: {
          options: async (value, { req }) => {
            const isExist = await interiorService.checkInteriorExist(value)
            if (!isExist) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_NOT_FOUND)
            }
            return true
          }
        }
      },
      'detail.*.quantity': {
        notEmpty: true
      }
    },
    ['body']
  )
)

export const quantityValidator = (detail: OrderDetail[]) => {
  const errorMessages: string[] = []
  detail.forEach(async (item, index) => {
    const { quantity, interior_id } = item
    const interior = await interiorService.getInteriorById(new Object(interior_id).toString())
    if (interior !== null) {
      if (parseInt(interior.quantity) < parseInt(quantity) || parseInt(quantity) === 0) {
        const message = `Detail[${index}].quantity : ${ORDER_MESSAGES.QUANTITY_IS_NOT_VALID}`
        errorMessages.push(message)
      }
    }
  })
  console.log(errorMessages)
  return errorMessages
}
