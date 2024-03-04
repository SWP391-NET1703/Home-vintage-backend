import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR, UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFormFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import databaseService from '../database/database.services'
import { ObjectId } from 'mongodb'
import interiorService from '../interiors/interior.services'
import { InteriorImage } from './interior_image.schema'

class InteriorImageServices {
  async handleUploadImage(req: Request) {
    const { type } = req.query
    const size = type ? 1 : 4
    const { id } = req.params
    //lưu ảnh vào trong upload
    const files = await handleUploadImage(req, size, UPLOAD_IMAGE_DIR)
    //xử lý file bằng sharp giúp tối ưu hình ảnh
    // const info = await sharp(file.filepath)
    const images: string[] = []
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFormFullName(file.newFilename) + '.jpg'
        const newFilePath = UPLOAD_IMAGE_DIR + '/' + newFileName
        await sharp(file.filepath).jpeg().toFile(newFilePath)
        fs.unlinkSync(file.filepath)
        // return isProduction
        //   ? `${process.env.HOST}/static/images/${newFileName}`
        images.push(newFileName)
        return images
      })
    )
    return images
  }

  //get interior image by interior id
  async getInteriorImageByInteriorId(id: string) {
    const interiorImage = await databaseService.interiorImage.findOne({ interior_id: new ObjectId(id) })
    return interiorImage
  }

  //create new interior image by thumbnail
  async createNewInteriorThumbnail(id: string, thumbnail: string) {
    const result = await databaseService.interiorImage.insertOne(
      new InteriorImage({
        _id: new ObjectId(),
        interior_id: new ObjectId(id),
        thumbnail: thumbnail
      })
    )
    const interiorImage = this.getInteriorImageByInteriorId(id)
    return interiorImage
  }
  async importImageInterior(id: string, images: string[]) {
    for (let index = 0; index < images.length; index++) {
      const result = await databaseService.interiorImage.updateOne(
        {
          _id: new ObjectId(id)
        },
        {
          $push: {
            images: images[index]
          }
        }
      )
    }
    return images
  }
}

const interiorImageServices = new InteriorImageServices()
export default interiorImageServices
