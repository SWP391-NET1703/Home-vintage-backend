import { ParamSchema, Schema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorService from '../interiors/interior.services'
import interiorImageServices from './interior_image.services'

const uploadImageIdSchema: ParamSchema = {
  optional: true,
  isLength: {
    options: {
      min: 24,
      max: 24
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_IS_NOT_VALID
  },
  custom: {
    options: async (value, { req }) => {
      const interiorImage = await interiorImageServices.getInteriorImageByInteriorId(value)

      if (!interiorImage) {
        throw new Error(INTERIOR_MESSAGES.INTERIOR_IS_NOT_EXIST)
      }
      return true
    }
  }
}

export const uploadImageThumbnailValidator = validate(
  checkSchema(
    {
      id: uploadImageIdSchema
    },
    ['query']
  )
)

export const uploadImageValidator = validate(checkSchema({ id: uploadImageIdSchema }, ['params']))
