import { NextFunction, Request, Response } from 'express'
import UserService from '../services/UserService'
import * as yup from 'yup'
import { ApiError } from '../helpers/ApiError'

class UserController {
  async index (req: Request, res: Response, next: NextFunction) {
    try {
      const Allusers = await UserService.index()
      const users = Allusers.map(({ password, ...restUser }) => restUser)
      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async findUserId (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const newUser = await UserService.findUserId(id)
      return res.status(200).json(newUser)
    } catch (error) {
      next(error)
    }
  }

  async store (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body
      const user = { name, email, password }

      const schema = yup.object().required().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required()
      })
      const isValid = await schema.isValid(user)
      if (!isValid) throw new ApiError(400, 'Schema to create user is invalidated')

      const isExistUserWithEmail = await UserService.findUserEmail(user.email)
      if (isExistUserWithEmail) throw new ApiError(409, 'E-mail already exists')

      const newUser = await UserService.store(user)
      const { password: _, ...restUser } = newUser

      return res.status(201).json(restUser)
    } catch (error) {
      next(error)
    }
  }

  async update (req: Request, res: Response, next: NextFunction) {
    try {
      const userUpdate = req.body
      const { id } = req.params

      const isExistUserWithId = await UserService.findUserId(id)
      if (!isExistUserWithId) throw new ApiError(404, 'User not exists')

      if (userUpdate.email) {
        const isExistUserWithEmail = await UserService.findUserEmail(userUpdate.email)
        if (isExistUserWithEmail) throw new ApiError(409, 'E-mail already exists')
      }

      await UserService.update(id, userUpdate)
      return res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }

  async destroy (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const isExistUserWithId = await UserService.findUserId(id)
      if (!isExistUserWithId) throw new ApiError(404, 'User not exists')

      await UserService.destroy(id)
      return res.sendStatus(204)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()
