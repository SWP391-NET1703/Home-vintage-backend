import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'

export const serveImageController = async (req: Request, res: Response) => {
  const { fileName } = req.params
  res.sendFile(path.resolve(UPLOAD_DIR, fileName), (error) => {
    if (error) {
      res.status((error as any).status).send('Not found image')
    }
  })
}
