import path from 'path'
import fs from 'fs'
import { Request } from 'express'
import formidable from 'formidable'
import { Files, File } from 'formidable'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import { isProduction } from '~/constants/config'

export const initFolder = () => {
  //sử dụng fs để thao tác với đường dẫn
  if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
    //kiểm tra xem đường dẫn đã tồn tại hay chưa
    fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
      recursive: true //cho phép tạo các folder nested vào nhau
    })
  }
}

//hàm xử lý file từ client gửi lên
export const handleUploadImage = (req: Request, size: number) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
    maxFileSize: 500 * 1024,
    maxFiles: size,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      //đang hỏi là cái file m đưa lên cho t có phải image không và dạng của nó có phải là image không
      if (!valid) {
        form.emit('error' as any, new Error('File is not an image') as any) //do đây là chuẩn xử lý lỗi của formidable nên mình ko cấu hình status
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        return reject(new Error('Image is empty'))
      }
      return resolve(files.image as File[])
    })
  })
}

export const getNameFormFullName = (fileName: string) => {
  //băm chuỗi tên file để lấy ra tên ext
  const nameArr = fileName.split('.')
  nameArr.pop()
  return nameArr.join('.')
}
