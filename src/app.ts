import express from 'express'
import cors from 'cors'

import routes from './routes'
import { PostgresDataSource } from './database/connection'
import { errorMiddleware } from './middlewares/error'

class App {
  public app: express.Application

  public constructor () {
    this.app = express()

    this.middlewares()
    this.database()
    this.routes()
    this.initializeErrorHandling()
  }

  private middlewares (): void {
    this.app.use(express.json())
    this.app.use(cors())
  }

  private database (): void {
    PostgresDataSource.initialize().then(() => {
      console.log('Data Source has been initialized!')
    }).catch((err) => {
      console.error('Error during Data Source initialization', err)
    })
  }

  private routes (): void {
    this.app.use(routes)
  }

  private initializeErrorHandling (): void {
    this.app.use(errorMiddleware)
  }
}

export default new App().app
