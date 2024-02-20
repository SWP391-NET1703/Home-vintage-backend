import { ParamSchema, checkSchema } from 'express-validator'
import databaseService from '../database/database.services'
import { validate } from '~/utils/validation'
import { INTERIOR_MESSAGES } from './interior.messages'
import categoryServices from '../categorys/category.services'
import { CATEGORY_MESSAGES } from '../categorys/category.message'
import { pick } from 'lodash'
import { NextFunction } from 'express'
import interiorService from './interior.services'
import Interior from './interior.schema'

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

const categoryIdSchema: ParamSchema = {
  notEmpty: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_IS_REQUIRED
  },
  isString: {
    errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 24,
      max: 24
    },
    errorMessage: CATEGORY_MESSAGES.CATEGORY_ID_IS_NOT_VALID
  },
  custom: {
    options: async (value, { req }) => {
      const isExist = await categoryServices.checkCategoryExist(value)
      if (!isExist) {
        throw new Error(CATEGORY_MESSAGES.CATEGORY_IS_NOT_EXIST)
      }
      return true
    }
  }
}

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
  isString: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_PRICE_MUST_BE_STRING
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

const warrantySchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_WARRANTY_IS_REQUIRED
  }
}

const statusSchema: ParamSchema = {
  notEmpty: {
    errorMessage: INTERIOR_MESSAGES.INTERIOR_STATUS_IS_REQUIRED
  }
}

const idInteriorSchema: ParamSchema = {
  notEmpty: true,
  isLength: {
    options: {
      min: 24,
      max: 24
    },
    errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_NOT_VALID
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
}

export const createInteriorValidator = validate(
  checkSchema(
    {
      interior_name: interiorNameSchema,
      category_id: categoryIdSchema,
      description: descriptionSchema,
      quantity: quantitySchema,
      price: priceSchema,
      material: materialSchema,
      size: sizeSchema,
      color: colorSchema,
      warranty: warrantySchema
    },
    ['body']
  )
)

export const updateInteriorValidator = validate(
  checkSchema(
    {
      interior_id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const interior = await interiorService.checkInteriorExist(value)
            if (!interior) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_NOT_FOUND)
            }
            return true
          }
        }
      },
      interior_name: {
        optional: true,
        ...interiorNameSchema,
        notEmpty: undefined
      },
      category_id: {
        optional: true,
        ...categoryIdSchema,
        notEmpty: undefined
      },
      description: {
        optional: true,
        ...descriptionSchema,
        notEmpty: undefined
      },
      quantity: {
        optional: true,
        ...quantitySchema,
        notEmpty: undefined
      },
      price: {
        optional: true,
        ...priceSchema,
        notEmpty: undefined
      },
      material: {
        optional: true,
        ...materialSchema,
        notEmpty: undefined
      },
      size: {
        optional: true,
        ...sizeSchema,
        notEmpty: undefined
      },
      color: {
        optional: true,
        ...colorSchema,
        notEmpty: undefined
      },
      warranty: {
        optional: true,
        ...warrantySchema,
        notEmpty: undefined
      },
      status: {
        optional: true,
        ...statusSchema,
        notEmpty: undefined
      }
    },
    ['body']
  )
)

export const idInteriorValidator = validate(
  checkSchema(
    {
      id: idInteriorSchema
    },
    ['params']
  )
)

export const updateImageInteriorValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const interior = await interiorService.getInteriorById(value)
            if (!interior) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_NOT_FOUND)
            }

            const { type } = req.query as { type: string }
            if (!type) {
              const { index } = req.query as { index: number }
              if (!index) {
                throw new Error(INTERIOR_MESSAGES.IMAGE_NOT_FOUND)
              }

              if (index < 0 || index >= interior.images.length) {
                throw new Error(INTERIOR_MESSAGES.IMAGE_NOT_FOUND)
              }
            }
            req.interior = interior
            return true
          }
        }
      }
    },
    ['params', 'query']
  )
)

export const uploadImageInteriorValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const interior = await interiorService.getInteriorById(value)
            if (!interior) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_NOT_FOUND)
            }

            const { type } = req.query as { type: string }
            if (type) {
              if (interior.thumbnail) {
                throw new Error(INTERIOR_MESSAGES.THUMBNAIL_IS_EXISTED)
              }
            } else {
              if (interior.images.length >= 5) {
                throw new Error(INTERIOR_MESSAGES.MAX_IMAGE_IS_5)
              }
            }
            req.interior = interior
            return true
          }
        }
      }
    },
    ['params', 'query']
  )
)

export const deleteImageInteriorValidator = validate(
  checkSchema(
    {
      id: {
        notEmpty: true,
        isLength: {
          options: {
            min: 24,
            max: 24
          },
          errorMessage: INTERIOR_MESSAGES.INTERIOR_ID_NOT_VALID
        },
        custom: {
          options: async (value, { req }) => {
            const interior = await interiorService.getInteriorById(value)
            if (!interior) {
              throw new Error(INTERIOR_MESSAGES.INTERIOR_NOT_FOUND)
            }

            const { type } = req.query as { type: string }
            const { index } = req.query as { index: number }
            if (type) {
              if (!interior.thumbnail) {
                //check thumbnail xem nó tồn tại hay không
                throw new Error(INTERIOR_MESSAGES.THUMBNAIL_IS_NOT_EXIST)
              }
            } else if (index) {
              if (index < 0 || index > interior.images.length) {
                //index có hợp lệ hay không
                throw new Error(INTERIOR_MESSAGES.IMAGE_NOT_FOUND)
              }
            }
            req.interior = interior
            return true
          }
        }
      }
    },
    ['params', 'query']
  )
)
