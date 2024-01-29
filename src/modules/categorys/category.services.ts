import { check } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'
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
    const categoryChild = result.filter((item) => {
      if (item.category_parent_id !== '') {
        return {
          category_id: item._id,
          category_parent_id: item.category_parent_id
        }
      }
    })

    const categoryParent = result.filter((item) => {
      if (item.category_parent_id === '') {
        return {
          category_id: item._id,
          category_parent_id: item.category_parent_id
        }
      }
    })

    const ListCategory: { category_parent: object; category_child: object[] }[] = []

    for (let i = 0; i < categoryParent.length; i++) {
      const categoryChild = result.filter((item) => {
        if (item.category_parent_id === String(categoryParent[i]._id)) {
          return {
            category_id: item._id,
            category_parent_id: item.category_parent_id
          }
        }
      })

      ListCategory.push({
        category_parent: categoryParent[i],
        category_child: categoryChild
      })
    }
    return ListCategory
  }
}
const categoryServices = new CategoryServices()
export default categoryServices
