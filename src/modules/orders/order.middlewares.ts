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

export const quantityValidator = async (detail: OrderDetail[]) => {
  const errorMessages: string[] = []
  for (let index = 0; index < detail.length; index++) {
    const item = detail[index]
    const errorMessagesLocal: string[] = []
    const { interior_id, quantity } = item
    const idString = new ObjectId(interior_id).toString()
    const interior = await interiorService.getInteriorById(idString)
    if (interior && parseInt(interior.quantity) < parseInt(quantity)) {
      errorMessagesLocal.push(`Detail[${index}].quantity : ${ORDER_MESSAGES.QUANTITY_IS_NOT_VALID}`)
      errorMessages.push(errorMessagesLocal.join(', '))
    }
  }
  console.log(errorMessages)
  return errorMessages
}
