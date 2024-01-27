import { check } from 'express-validator'
import { ObjectId } from 'mongodb'
import { CreateCategoryReqBody } from './category.request'
import databaseService from '../database/database.services'
import Category from './category.schema'

class CategoryServices {
  async createCategory(payload: CreateCategoryReqBody) {
    const category_id = new ObjectId()
    const { name, parent_id } = payload
    const result = await databaseService.categorys.insertOne(
      new Category({
        _id: category_id,
        category_name: name,
        category_parent_id: parent_id
      })
    )
  }

  async checkCategoryExist(category_id: string) {
    const category = await databaseService.categorys.findOne({ _id: new ObjectId(category_id) })
    return Boolean(category)
  }

  async getListCategory() {
    const result = await databaseService.categorys.find({}).toArray()
    return result
  }
}
const categoryServices = new CategoryServices()
export default categoryServices
