import { check, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CATEGORY_MESSAGES } from './category.message'
import categoryServices from './category.services'
import exp from 'constants'

export const createCategoryValidator = validate(
  checkSchema(
    {
      category_name: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.NAME_CATEGORY_IS_REQUIRED
        },
        trim: true
      },

      category_parent_id: {
        custom: {
          options: async (value, { req }) => {
            if (value) {
              const isExist = await categoryServices.checkCategoryExist(value)
              if (!isExist) {
                throw new Error(CATEGORY_MESSAGES.CATEGORY_IS_NOT_EXIST)
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateCategoryValidator = validate(
  checkSchema(
    {
      category_id: {
        custom: {
          options: async (value, { req }) => {
            const isExist = await categoryServices.checkCategoryExist(value)
            if (!isExist) {
              throw new Error(CATEGORY_MESSAGES.CATEGORY_IS_NOT_EXIST)
            }
            return true
          }
        }
      },
      category_name: {
        notEmpty: {
          errorMessage: CATEGORY_MESSAGES.NAME_CATEGORY_IS_REQUIRED
        },
        trim: true
      },

      category_parent_id: {
        custom: {
          options: async (value, { req }) => {
            if (value) {
              const isExist = await categoryServices.checkCategoryExist(value)
              if (!isExist) {
                throw new Error(CATEGORY_MESSAGES.CATEGORY_IS_NOT_EXIST)
              }
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const deleteCategoryValidator = validate(
  checkSchema(
    {
      category_id: {
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
    },
    ['body']
  )
)
