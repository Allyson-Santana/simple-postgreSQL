import { PostgresDataSource } from '../database/connection'
import { User } from '../entities/User'

export const userRepository = PostgresDataSource.getRepository(User)
