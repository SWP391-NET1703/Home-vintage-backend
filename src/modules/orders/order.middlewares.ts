import { check, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorService from '../interiors/interior.services'
import Order, { OrderDetail } from './order.schema'
import { ObjectId } from 'mongodb'
import { ORDER_MESSAGES } from './order.messages'
import { orderService, updateInteriorQuantity } from './order.services'
import { OrderStatus } from './order.enum'
import { TokenPayload } from '../users/User.request'
import { decode } from 'punycode'
import { ErrorWithStatus } from '../errors/error.model'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'

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
  return errorMessages
}

export const acceptOrderValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            max: 24,
            min: 24
          },
          errorMessage: ORDER_MESSAGES.ORDER_IS_NOT_EXIST
        },
        custom: {
          options: async (value, { req }) => {
            const order = await orderService.getOrderById(value)
            if (!order) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_EXIST)
            }

            if (
              [OrderStatus.Pack_products, OrderStatus.Pack_products, OrderStatus.Success].includes(
                order.status_of_order
              )
            ) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_VALID_TO_ACCEPT)
            }

            // quantityValidator(order.detail)
            updateInteriorQuantity(order.detail)
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const shippingOrderValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: ORDER_MESSAGES.ORDER_IS_NOT_EXIST
        },
        custom: {
          options: async (value, { req }) => {
            const order = await orderService.getOrderById(value)
            if (!order) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_EXIST)
            }

            if (order.status_of_order !== OrderStatus.Pack_products) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_VALID_TO_DELIVERY)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const deleteOrderValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: ORDER_MESSAGES.ORDER_IS_NOT_EXIST
        },
        custom: {
          options: async (value, { req }) => {
            const order = await orderService.getOrderById(value)
            if (!order) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_EXIST)
            }

            if (order.status_of_order === OrderStatus.Cancel) {
              throw new Error(ORDER_MESSAGES.ORDER_IS_NOT_VALID_TO_DELETE)
            }

            const { decoded_authorization } = req.headers as { decoded_authorization: TokenPayload }
            const { user_id } = decoded_authorization
            if (user_id !== order.customer_id.toString()) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.THIS_IS_NOT_YOUR_ORDER,
                status: HTTP_STATUS.FORBIDDEN
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
