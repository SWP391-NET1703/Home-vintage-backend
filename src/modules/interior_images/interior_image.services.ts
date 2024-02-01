import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFormFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import databaseService from '../database/database.services'
import { ObjectId } from 'mongodb'

class InteriorImageServices {
  async handleUploadImage(req: Request) {
    const { type } = req.query
    const size = type ? 1 : 4
    const { id } = req.params
    //lưu ảnh vào trong upload
    const files = await handleUploadImage(req, size as number)
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
        const url = `http://localhost:${process.env.PORT}/static/images/${newFileName}`
        if (type) {
          const interiorThumbnail = await databaseService.interiors.findOneAndUpdate({ _id: new ObjectId(id) }, [
            {
              $set: {
                thumbnail: url
              }
            }
          ])
        } else {
          const interiorImage = await databaseService.interiors.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
              $push: {
                images: url
              }
            }
          )
        }
      })
    )
  }
}

const interiorImageServices = new InteriorImageServices()
export default interiorImageServices
