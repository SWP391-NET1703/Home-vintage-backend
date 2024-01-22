import { ParamSchema, checkSchema } from 'express-validator'
import databaseService from '../database/database.services'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from './interior.messages'

const interiorNameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_NAME_REQUIRED
  },
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_NAME_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 3,
      max: 50
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_NAME_LENGTH_MUST_BE_FROM_2_TO_50
  }
}

// const category_id: ParamSchema = {
//   notEmpty: {
//     errorMessage: 'Category id is required'
//   },
//   isString: {
//     errorMessage: 'Category id must be string'
//   },
//   custom: {
//     options: async (value, { req }) => {
//       const isExist = await databaseService.categorys.findOne({ value })
//       if (!isExist) {
//         throw new Error('Category is not exist')
//       }
//       return true
//     }
//   }
// }

const descriptionSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_DESCRIPTION_IS_REQUIRED
  },
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_DESCRIPTION_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_DESCRIPTION_MUST_BE_FROM_1_TO_100
  }
}

const quantitySchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_QUANTITY_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_QUANTITY_MUST_BE_NUMBER
  }
}

const priceSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_PRICE_IS_REQUIRED
  },
  isNumeric: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_PRICE_MUST_BE_NUMBER
  }
}

const materialSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_MATERIAL_IS_REQUIRED
  },
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_MATERIAL_MUST_BE_STRING
  }
}

const sizeSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_SIZE_IS_REQUIRED
  },
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_SIZE_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_SIZE_MUST_BE_FROM_1_TO_100
  }
}

const colorSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_COLOR_IS_REQUIRED
  },
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_COLOR_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 50
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_COLOR_MUST_BE_FROM_1_TO_50
  }
}

export const createInteriorValidator = validate(
  checkSchema(
    {
      interior_name: interiorNameSchema,
      description: descriptionSchema,
      quantity: quantitySchema,
      price: priceSchema,
      material: materialSchema,
      size: sizeSchema,
      color: colorSchema
    },
    ['body']
  )
)
