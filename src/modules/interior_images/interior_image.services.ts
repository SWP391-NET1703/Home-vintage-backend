import { Request, Response } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFormFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import databaseService from '../database/database.services'
import { ObjectId } from 'mongodb'
import interiorService from '../interiors/interior.services'
import Interior from '../interiors/interior.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import formidable from 'formidable'

class InteriorImageServices {
  async handleUploadImage(req: Request) {
    const { type } = req.query
    const size = type ? 1 : 5
    const { id } = req.params
    let urlImage
    const images: string[] = []
    //lưu ảnh vào trong upload

    const files = await handleUploadImage(req, size as number)
    const { interior } = req
    if (interior && !type) {
      if (files.length + interior.images.length > 5) {
        return INTERIOR_MESSAGES.MAX_IMAGE_IS_5
      }
    }
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
          const interiorThumbnail = await interiorService.updateThumbnail(id, url)
          urlImage = {
            thumbnail: url
          }
        } else {
          const interiorImage = await interiorService.uploadImage(id, url)
          images.push(url)
          urlImage = {
            images: images
          }
        }
      })
    )
    return urlImage
  }

  async handleUpdateImage(req: Request, interior: Interior) {
    const index = parseInt(req.query.index as string)
    const size = 1
    const { type } = req.query
    const { id } = req.params
    //lưu ảnh vào trong upload
    const files = await handleUploadImage(req, size)
    //xử lý file bằng sharp giúp tối ưu hình ảnh
    // const info = await sharp(file.filepath)
    const image = type ? interior.thumbnail.split('/').pop() : interior.images[index].split('/').pop()
    if (image) {
      fs.unlinkSync(UPLOAD_DIR + '\\' + image)
    }
    let urlImage
    const images: string[] = []
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = getNameFormFullName(file.newFilename) + '.jpg'
        const newFilePath = UPLOAD_DIR + '/' + newFileName
        await sharp(file.filepath).jpeg().toFile(newFilePath)
        fs.unlinkSync(file.filepath)

        const url = `http://localhost:${process.env.PORT}/static/images/${newFileName}`
        if (type) {
          const interiorThumbnail = await interiorService.updateThumbnail(id, url)
          urlImage = {
            thumbnail: url
          }
        } else {
          const interiorImage = await interiorService.updateImage(id, index, url)
          images.push(url)
          urlImage = {
            images: images
          }
        }
      })
    )
    return urlImage
  }

  async handleDeleteImage(req: Request, interior: Interior) {
    const { id } = req.params
    const index = parseInt(req.query.index as string)
    const { type } = req.query as { type: string }
    if (type) {
      const nameImageThumbnail = interior.thumbnail.split('/').pop()
      if (nameImageThumbnail) {
        fs.unlinkSync(UPLOAD_DIR + '\\' + nameImageThumbnail)
        const result = await interiorService.deleteThumbnail(id)
      }
    } else if (index) {
      if (interior.images[index]) {
        const nameImageInterior = interior.images[index].split('/').pop()
        fs.unlinkSync(UPLOAD_DIR + '\\' + nameImageInterior)
        const result = await interiorService.deleteOneImage(id, index, interior.images[index])
      }
    } else {
      const images = interior.images
      images.forEach((image) => {
        const imageName = image.split('/').pop()
        fs.unlinkSync(UPLOAD_DIR + '\\' + imageName)
      })
      const result = await interiorService.deleteAllImage(id)
    }

    return
  }
}

const interiorImageServices = new InteriorImageServices()
export default interiorImageServices
