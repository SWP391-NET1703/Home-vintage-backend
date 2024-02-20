import { ObjectId } from 'mongodb'
import databaseService from '../database/database.services'
import { CreateInteriorReqBody, UpdateInteriorBody } from './interior.request'
import Interior from './interior.schema'
import { InteriorStatus, InteriorWarranty } from './interior.enums'
class InteriorService {
  async createInterior(payload: CreateInteriorReqBody) {
    const { interior_name, description, quantity, price, material, category_id, color, size, warranty } = payload
    const interior_id = new ObjectId()
    const result = await databaseService.interiors.insertOne(
      new Interior({
        _id: interior_id,
        interior_name: interior_name as string,
        category_id: new ObjectId(),
        description: description as string,
        quantity: quantity,
        price: price,
        thumbnail: '',
        material: material as string,
        color: color as string,
        size: size as string,
        warranty: warranty as InteriorWarranty,
        status: InteriorStatus.Stock,
        image: [],
        created_at: new Date(),
        updated_at: new Date()
      })
    )
    const interior = await databaseService.interiors.findOne({ _id: result.insertedId })
    return interior
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

  async updateInterior(id: string, payload: UpdateInteriorBody) {
    const result = await databaseService.interiors.findOneAndUpdate({ _id: new ObjectId(id) }, [
      {
        $set: {
          ...payload,
          update_at: '$$NOW'
        }
      }
    ])

    const interior = await databaseService.interiors.findOne({ _id: new ObjectId(id) })
    return interior
  }

  async getInteriorById(id: string) {
    const interior = await databaseService.interiors.findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          create_at: 0,
          update_at: 0
        }
      }
    )
    return interior
  }

  async updateThumbnail(id: string, url: string) {
    const interiorThumbnail = await databaseService.interiors.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          thumbnail: url,
          updated_at: new Date()
        }
      }
    )
  }

  async uploadImage(id: string, url: string) {
    const interiorImage = await databaseService.interiors.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $push: {
          images: url
        }
      }
    )
    return interiorImage
  }

  async updateImage(id: string, index: number, url: string) {
    const interiorImage = await databaseService.interiors.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          [`images.${index}`]: url
        }
      }
    )
    return interiorImage
  }

  async deleteOneImage(id: string, index: number, url: string) {
    const result = await databaseService.interiors.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: {
          images: { $in: [url] }
        }
      }
    )
    return result
  }

  async deleteAllImage(id: string) {
    const result = await databaseService.interiors.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          images: [],
          updated_at: new Date()
        }
      }
    )
    return result
  }

  async disableInterior(id: string) {
    const result = await databaseService.interiors.findOneAndUpdate(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          status: InteriorStatus.Stop_bussiness
        }
      }
    )
  }

  async deleteThumbnail(id: string) {
    const result = await databaseService.interiors.findOneAndUpdate(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          thumbnail: ''
        }
      }
    )
  }
}

const interiorService = new InteriorService()
export default interiorService
