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
  async handleUploadImage(req: Request, size: number) {
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

  async getInteriorImageById(id: string) {
    const interiorImage = await databaseService.interiorImage.findOne({ _id: new ObjectId(id) })
    return interiorImage
  }

  //create new interior image by thumbnail
  async createNewInteriorThumbnail(thumbnail: string) {
    const result = await databaseService.interiorImage.insertOne(
      new InteriorImage({
        _id: new ObjectId(),
        interior_id: new ObjectId(),
        thumbnail: thumbnail
      })
    )
    const interiorImage = this.getInteriorImageById(result.insertedId.toString())
    return interiorImage
  }

  async updateThumbnailImageInterior(id: string, thumbnail: string) {
    const result = await databaseService.interiorImage.updateOne(
      {
        interior_id: new ObjectId(id)
      },
      {
        $set: {
          thumbnail: thumbnail
        }
      }
    )

    const interiorImage = this.getInteriorImageByInteriorId(id)
    return interiorImage
  }

  async importImageInterior(id: string, images: string[]) {
    console.log(id)
    for (let index = 0; index < images.length; index++) {
      const result = await databaseService.interiorImage.updateOne(
        {
          interior_id: new ObjectId(id)
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

  async createNewInteriorImage(images: string[]) {
    const result = await databaseService.interiorImage.insertOne(
      new InteriorImage({ _id: new ObjectId(), interior_id: new ObjectId(), images: images })
    )
    const interiorImage = await this.getInteriorImageById(result.insertedId.toString())
    return interiorImage
  }
}

const interiorImageServices = new InteriorImageServices()
export default interiorImageServices
