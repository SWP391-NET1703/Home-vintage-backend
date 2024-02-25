import { ObjectId } from 'mongodb'
import databaseService from '../database/database.services'
import { CreateInteriorReqBody } from './interior.request'
import Interior from './interior.schema'
import { InteriorResponse } from './interior.response'
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

  async checkInteriorExist(id: string) {
    let interior = null
    if (id.length !== 24) {
      interior = null
      return interior
    }
    interior = await databaseService.interiors.findOne({ _id: new ObjectId(id) })
    return Boolean(interior)
  }

  async getInteriorById(id: string): Promise<InteriorResponse | null> {
    //định nghĩa lại kiểu trả về cho aggregation bằng generic và lookup với category
    const interiorCursor = databaseService.interiors.aggregate<InteriorResponse>([
      {
        $match: {
          _id: new ObjectId(id)
        }
      },
      {
        $lookup: {
          from: process.env.DB_CATEGORYS_COLLECTION as string,
          localField: 'category_id',
          foreignField: '_id',
          as: 'category_detail'
        }
      },
      {
        $addFields: {
          category_detail: {
            $arrayElemAt: ['$category_detail', 0]
          }
        }
      }
    ])
    const interior = await interiorCursor.toArray()

    // Kiểm tra nếu không có interior, trả về null
    if (interior.length === 0) {
      return null
    }

    // Trả về interior đầu tiên từ kết quả aggregation
    return interior[0]
  }

  async updateInteriorQuantity(quantity: number, id: string) {
    const result = await databaseService.interiors.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          quantity: quantity.toString()
        }
      }
    )
  }
}

const interiorService = new InteriorService()
export default interiorService
