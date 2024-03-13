import { check, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { SCHEDULE_MESSAGES } from './schedule.message'
import scheduleServices from './schedule.services'

export const registerScheduleValidator = validate(
  checkSchema(
    {
      date_book: {
        notEmpty: true
      },
      price: {
        notEmpty: true,
        custom: {
          options: (value) => {
            if (parseInt(value) < 500000) {
              throw new Error(SCHEDULE_MESSAGES.PRICE_MUST_BE_500000)
            }
            return true
          }
        }
      },
      type_room: {
        notEmpty: true
      }
    },
    ['body']
  )
)

export const rejectScheduleValidator = validate(
  checkSchema(
    {
      schedule_id: {
        notEmpty: true,
        custom: {
          options: async (value) => {
            const isExist = await scheduleServices.getScheduleById(value)
            if (!isExist) {
              throw new Error(SCHEDULE_MESSAGES.SCHEDULE_NOT_FOUND)
            }
          }
        }
      },
      reason_reject: {
        notEmpty: true
      }
    },
    ['body']
  )
)

export const confirmScheduleValidator = validate(
  checkSchema(
    {
      schedule_id: {
        notEmpty: true,
        custom: {
          options: async (value) => {
            const isExist = await scheduleServices.getScheduleById(value)
            if (!isExist) {
              throw new Error(SCHEDULE_MESSAGES.SCHEDULE_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
