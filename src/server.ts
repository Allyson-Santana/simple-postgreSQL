import 'express-async-error'
import 'dotenv/config'
import 'reflect-metadata'

import app from './app'

app.listen(3333, 'localhost', () => {
  console.info('Server running in http://localhost:3333')
})
