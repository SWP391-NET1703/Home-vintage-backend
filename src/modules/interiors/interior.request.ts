import e from 'express'
import { InteriorWarranty } from './interior.enums'

export interface CreateInteriorReqBody {
  interior_name: string
  description: string
  quantity: string
  price: string
  material: string
  category_id: string
  size: string
  color: string
  warranty: InteriorWarranty
}

export interface UpdateInteriorBody {
  interior_name?: string
  description?: string
  quantity?: string
  price?: string
  material?: string
  category_id?: string
  size?: string
  color?: string
  warranty?: InteriorWarranty
  status?: boolean
}
