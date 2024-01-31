import { check } from 'express-validator'
import { ObjectId, ReturnDocument, WithId } from 'mongodb'
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
    const ListCategory: {
      category_id: ObjectId
      category_name: string
      category_child: object[]
    }[] = []

    const categoryParent = result.filter((item) => {
      if (item.category_parent_id === '') {
        return {
          category_id: item._id,
          category_name: item.category_name
        }
      }
    })

    for (let i = 0; i < categoryParent.length; i++) {
      const categoryChild = result
        .filter((item) => {
          return item.category_parent_id === String(categoryParent[i]._id)
        })
        .map((item) => {
          return {
            category_id: item._id,
            category_name: item.category_name
          }
        })

      ListCategory.push({
        category_id: categoryParent[i]._id,
        category_name: categoryParent[i].category_name,
        category_child: categoryChild
      })
    }
    return ListCategory
  }

  async updateCategory(payload: { category_id: string; category_name: string; category_parent_id: string }) {
    const { category_id, category_name, category_parent_id } = payload
    const result = await databaseService.categorys.findOneAndUpdate(
      { _id: new ObjectId(category_id) },
      [{ $set: { category_name: category_name, category_parent_id: category_parent_id } }],
      {
        returnDocument: 'after'
      }
    )
    return result.value
  }
}
const categoryServices = new CategoryServices()
export default categoryServices
