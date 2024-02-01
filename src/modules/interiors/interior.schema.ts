import { ObjectId } from 'mongodb'
import { InteriorStatus, InteriorWarranty } from './interior.enums'

interface InteriorTpye {
  _id?: ObjectId
  category_id: ObjectId
  interior_name: string
  description: string
  quantity: string
  price: string
  material: string
  size: string
  color: string
  warranty?: InteriorWarranty
  thumbnail?: string
  sale?: boolean
  created_at?: Date
  status?: InteriorStatus
  image?: string[]
}

export default class Interior {
  _id?: ObjectId
  category_id: ObjectId
  interior_name: string
  description: string
  quantity: string
  price: string
  material: string
  size: string
  color: string
  images: string[]
  warranty?: InteriorWarranty
  sale?: boolean
  created_at?: Date
  status?: InteriorStatus

  constructor(interior: InteriorTpye) {
    const date = new Date()
    this._id = interior._id || new ObjectId()
    this.category_id = interior.category_id
    this.interior_name = interior.interior_name
    this.description = interior.description
    this.quantity = interior.quantity
    this.price = interior.price
    this.material = interior.material
    this.size = interior.size
    this.color = interior.color
    this.images = interior.image || []
    this.warranty = interior.warranty || InteriorWarranty.six_months
    this.created_at = interior.created_at || date
    this.sale = interior.sale || false
    this.status = interior.status || InteriorStatus.Stock
  }
}
