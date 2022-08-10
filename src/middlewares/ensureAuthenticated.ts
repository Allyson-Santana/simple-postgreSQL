import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../helpers/ApiError'
import JWT from 'jsonwebtoken'

export const ensureAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new Error()

    const [, token] = authorization.split(' ')

    JWT.verify(token, process.env.JWT_SECRET ?? '')

    return next()
  } catch (error) {
    next(new ApiError(401, 'Token unauthorized'))
  }
}
