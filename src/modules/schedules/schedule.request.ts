import { TypeRoom } from './schedule.enum'

export interface RegisterScheduleReqBody {
  date_book: Date
  price: string
  type_room: TypeRoom
}

export interface RejectScheduleReqBody {
  schedule_id: string
  reason_reject: string
}
