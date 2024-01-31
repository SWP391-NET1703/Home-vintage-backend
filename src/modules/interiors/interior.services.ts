import { ObjectId } from 'mongodb'
import databaseService from '../database/database.services'
import { CreateInteriorReqBody } from './interior.request'
import Interior from './interior.schema'
class InteriorService {
  async createInterior(payload: CreateInteriorReqBody) {
    const { interior_name, description, quantity, price, material, category_id, color, size } = payload
    const interior_id = new ObjectId()
    const result = await databaseService.interiors.insertOne(
      new Interior({
        _id: interior_id,
        interior_name: interior_name as string,
        category_id: new ObjectId(),
        description: description as string,
        quantity: quantity,
        price: price,
        material: material as string,
        color: color as string,
        size: size as string,
        image: []
      })
    )

    return result
  }
}

const interiorService = new InteriorService()
export default interiorService
