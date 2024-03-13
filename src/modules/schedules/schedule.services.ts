import { ObjectId } from 'mongodb'
import databaseService from '../database/database.services'
import { RegisterScheduleReqBody, RejectScheduleReqBody } from './schedule.request'
import { StatusSchedule } from './schedule.enum'
import { ScheduleResponse } from './schedule.response'

class ScheduleServices {
  async registerSchedule(body: RegisterScheduleReqBody, user_id: string) {
    const { date_book, price, type_room } = body
    const newSchedule = await databaseService.schedule.insertOne({
      _id: new ObjectId(),
      customer_id: new ObjectId(user_id),
      date_book,
      price,
      type_room,
      status: StatusSchedule.Pending
    })

    const schedule = await this.getScheduleById(newSchedule.insertedId.toString())
    return schedule
  }

  async getScheduleById(id: string) {
    const schedule = await databaseService.schedule.aggregate<ScheduleResponse>([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: process.env.DB_USERS_COLLECTION as string,
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer_info'
        }
      },
      {
        $addFields: {
          customer_info: {
            $arrayElemAt: ['$customer_info', 0]
          }
        }
      },
      {
        //trường customer_info lấy số điện thoại tên, id, email của khách hàng
        $project: {
          customer_info: {
            _id: 1,
            full_name: 1,
            email: 1,
            phone_number: 1
          },
          date_book: 1,
          price: 1,
          type_room: 1,
          status: 1
        }
      }
    ])
    return schedule.toArray()
  }

  async getListScheduleToConfirm() {
    const listSchedule = await databaseService.schedule.aggregate<ScheduleResponse>([
      {
        $lookup: {
          from: process.env.DB_USERS_COLLECTION as string,
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer_info'
        }
      },
      {
        $addFields: {
          customer_info: {
            $arrayElemAt: ['$customer_info', 0]
          }
        }
      },
      {
        $project: {
          customer_info: {
            _id: 1,
            full_name: 1,
            email: 1,
            phone_number: 1
          },
          date_book: 1,
          price: 1,
          type_room: 1,
          status: 1
        }
      }
    ])
    return listSchedule.toArray()
  }

  async rejectSchedule(body: RejectScheduleReqBody) {
    const { schedule_id, reason_reject } = body
    await databaseService.schedule.updateOne(
      {
        _id: new ObjectId(schedule_id)
      },
      {
        $set: {
          status: StatusSchedule.Rejected,
          reason_reject
        }
      }
    )
    return
  }

  async confirmSchedule(schedule_id: string) {
    const result = await databaseService.schedule.updateOne(
      { _id: new ObjectId(schedule_id) },
      { $set: { status: StatusSchedule.Approved } }
    )
    return
  }
}

const scheduleServices = new ScheduleServices()

export default scheduleServices
