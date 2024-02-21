import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorService from '../interiors/interior.services'
import { OrderDetail } from './order.schema'

export const createOrderValidator = validate(
  checkSchema(
    {
      '*interior_id': {
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
      '*quantity': {
        notEmpty: true,
        custom: {
          options: async (value, { req }) => {
            const { detail } = req.body as { detail: OrderDetail }
            const { interior_id } = detail
          }
        }
      }
    },
    ['body']
  )
)
