import { ObjectId } from 'mongodb'
import databaseService from '../database/database.services'

class StaffService {
  async updateActivityStaff(payload: { user_id: string; day_on: number; day_off: number }) {
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(payload.user_id) },
      { $set: { day_on: payload.day_on, day_off: payload.day_off } },
      { returnDocument: 'after' }
    )
    return user.value
  }

  async checkIDExist(id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(id) })
    return user !== null
  }
}
const staffService = new StaffService()
export default staffService
