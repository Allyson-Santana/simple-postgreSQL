import { ICreateUser, IUser } from '../interfaces/user'
import { userRepository } from '../repositiries/userRepository'
import bcrypt from 'bcrypt'

class UserService {
  async index (): Promise<IUser[]> {
    const users = await userRepository.find()
    return users
  }

  async findUserEmail (email: string): Promise<IUser | null> {
    const user = await userRepository.findOne({ where: { email } })
    return user
  }

  async findUserId (id: string): Promise<IUser | null> {
    const users = await userRepository.findOneBy({ id })
    return users
  }

  async store (user: ICreateUser): Promise<IUser> {
    const hashPassword = await bcrypt.hash(user.password, 8)

    const newUser = userRepository.create({
      ...user,
      password: hashPassword
    })

    await userRepository.save(newUser)
    return newUser
  }

  async update (id: string, userUpdate: IUser): Promise<void> {
    const currentUser = await userRepository.findOneBy({ id })
    await userRepository.update(id, {
      ...currentUser,
      ...userUpdate
    })
  }

  async destroy (id: string): Promise<void> {
    await userRepository.delete(id)
  }
}

export default new UserService()
