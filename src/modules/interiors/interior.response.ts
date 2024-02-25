import { ObjectId } from 'mongodb'
import { InteriorStatus, InteriorWarranty } from './interior.enums'
import Category from '../categorys/category.schema'

export interface InteriorResponse {
  _id?: ObjectId
  category_id: ObjectId
  interior_name: string
  description: string
  quantity: string
  price: string
  material: string
  size: string
  color: string
  warranty: InteriorWarranty
  thumbnail: string
  sale: boolean
  created_at?: Date
  status?: InteriorStatus
  image: string[]
  catetogy_detail: Category
}
