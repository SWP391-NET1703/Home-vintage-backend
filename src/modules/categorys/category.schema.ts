import exp from 'constants'
import { ObjectId } from 'mongodb'

interface CategoryType {
  _id?: ObjectId
  category_name: string
  category_parent_id?: string
}

export default class Category {
  _id?: ObjectId
  category_name: string
  category_parent_id?: string

  constructor(category: CategoryType) {
    this._id = category._id || new ObjectId()
    this.category_name = category.category_name
    this.category_parent_id = category.category_parent_id || ''
  }
}

// interface listCategoryType {
//   category_parent: Category[]
//   category_child?: Category[]
// }

// export class ListCategory {
//   category_parent: Category[]
//   category_child?: Category[]

//   constructor(listCategory: listCategoryType) {
//     this.category_parent = listCategory.category_parent
//     this.category_child = listCategory.category_child
//   }
// }
