import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import * as yup from 'yup'
import { ApiError } from '../helpers/ApiError'
import UserService from '../services/UserService'
import JWT from 'jsonwebtoken'
import { IPayloadJWT } from '../interfaces/jwt'

class AuthenticateUserController {
  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
      })

      const isValid = await schema.isValid({ email, password })
      if (!isValid) throw new ApiError(400, 'E-mail and password is required')

      const userAlreadyExists = await UserService.findUserEmail(email)
      if (!userAlreadyExists) throw new ApiError(400, 'E-mail or password incorrect')

      const verifyPassword = bcrypt.compare(password, userAlreadyExists.password)
      if (!verifyPassword) throw new ApiError(400, 'E-mail or password incorrect')

      const token = JWT.sign({ id: userAlreadyExists.id }, process.env.JWT_SECRET ?? '', {
        subject: userAlreadyExists.id,
        expiresIn: '1h'
      })

      const { password: _, ...userInfo } = userAlreadyExists

      return res.status(200).json({ user: userInfo, token })
    } catch (error) {
      next(error)
    }
  }

  async getProfile (req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers

      if (!authorization) throw new ApiError(401, 'Token unauthorized')

      const [, token] = authorization.split(' ')

      const { id } = JWT.verify(token, process.env.JWT_SECRET ?? '') as IPayloadJWT

      const user = await UserService.findUserId(id)

      if (!user) throw new ApiError(404, 'User not exists')

      const { password: _, ...userInfo } = user

      return res.status(200).json({ user: userInfo })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthenticateUserController()
