import { ObjectId } from 'mongodb'
import { StatusSchedule, TypeRoom } from './schedule.enum'

interface ScheduleType {
  _id?: ObjectId
  customer_id: ObjectId
  date_book: Date
  price: string
  type_room: TypeRoom
  status: StatusSchedule
  reason_reject?: string
}

export class Schedule {
  _id?: ObjectId
  customer_id: ObjectId
  date_book: Date
  price: string
  type_room: TypeRoom
  status: StatusSchedule
  reason_reject?: string

  constructor(schedule: ScheduleType) {
    this._id = schedule._id
    this.customer_id = schedule.customer_id
    this.date_book = schedule.date_book
    this.price = schedule.price
    this.type_room = schedule.type_room
    this.status = schedule.status
    this.reason_reject = schedule.reason_reject || ''
  }
}
