import { DataSource } from 'typeorm'
import { join } from 'path'

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_DB_HOST,
  port: Number(process.env.TYPEORM_DB_PORT),
  username: process.env.TYPEORM_DB_USERNAME,
  password: process.env.TYPEORM_DB_PASSWORD,
  database: process.env.TYPEORM_DB_DATABASE,
  entities: [join(__dirname, '../entities/*.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')]
})
