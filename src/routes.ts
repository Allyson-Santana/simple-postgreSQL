import { Router } from 'express'
import UserController from './controllers/UserController'
import AuthenticateUserController from './controllers/AuthenticateUserController'
import { ensureAuthenticated } from './middlewares/ensureAuthenticated'

const routes = Router()

routes.get('/', (req, res) => {
  res.json({ status: 200, message: 'OK' })
})

routes.post('/users/login', AuthenticateUserController.login)
routes.post('/users', UserController.store)
routes.get('/users/:id', UserController.findUserId)
routes.get('/users', UserController.index)

routes.use(ensureAuthenticated)

routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.destroy)

export default routes
