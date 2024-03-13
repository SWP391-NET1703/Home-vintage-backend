import { ObjectId } from 'mongodb'

export interface ScheduleResponse {
  _id: ObjectId
  customer_info: {
    _id: ObjectId
    name: string
    email: string
    phone: string
  }
  date_book: string
  price: number
  type_room: string
  status: string
}
