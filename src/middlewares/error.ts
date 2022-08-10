import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../helpers/ApiError'

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500
  const message = error.statusCode ? error.message : 'Internal Server Error'

  console.error(`\nstatus: ${statusCode} with message: ${error.message}\n`)

  return res.status(statusCode).json({ statusCode, message })
}
