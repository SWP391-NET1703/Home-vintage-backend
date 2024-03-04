import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorService from '../interiors/interior.services'

export const uploadImageThumbnailValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_IS_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const interior = await interiorService.getInteriorById(value)
            if (!interior) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_IS_NOT_EXIST)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
