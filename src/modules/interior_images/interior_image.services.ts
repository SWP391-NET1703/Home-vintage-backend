import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFormFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import databaseService from '../database/database.services'
import { InteriorImage } from './interior_images.schema'
import { ObjectId } from 'mongodb'
import { InteriorImageStatus } from './interior_image.enum'

class InteriorImageServices {
  async handleUploadImage(req: Request) {
    //lưu ảnh vào trong upload
    const files = await handleUploadImage(req)
    //xử lý file bằng sharp giúp tối ưu hình ảnh
    // const info = await sharp(file.filepath)
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFormFullName(file.newFilename) + '.jpg'
        const newFilePath = UPLOAD_DIR + '/' + newFileName
        await sharp(file.filepath).jpeg().toFile(newFilePath)
        fs.unlinkSync(file.filepath)
        // return isProduction
        //   ? `${process.env.HOST}/static/images/${newFileName}`
        //   : `http://localhost:${process.env.PORT}/static/images/${newFileName}`
        const data = await databaseService.interiorImages.insertOne(
          new InteriorImage({
            _id: new ObjectId(),
            image_name: newFileName,
            interior_id: new ObjectId().toString(),
            thumbnail: true
          })
        )
      })
    )
    return
  }
}

const interiorImageServices = new InteriorImageServices()
export default interiorImageServices
