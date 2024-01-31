import { ObjectId } from 'mongodb'
import { InteriorImageStatus } from './interior_image.enum'

export interface InteriorImageType {
  _id?: ObjectId
  image_name: string
  interior_id: string
  thumbnail: boolean
}

export class InteriorImage {
  _id?: ObjectId
  image_name: string
  interior_id: string
  thumbnail: boolean
  constructor(interiorImage: InteriorImageType) {
    this._id = interiorImage._id
    this.image_name = interiorImage.image_name
    this.interior_id = interiorImage.interior_id
    this.thumbnail = interiorImage.thumbnail
  }
}
