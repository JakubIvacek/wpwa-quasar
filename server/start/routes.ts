/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('register', 'AuthController.register')
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout').middleware('auth')
  Route.get('me', 'AuthController.me').middleware('auth')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'ChannelController.getAll') //TODO this endpoint will be deleted dont use it
  Route.get('/:id', 'ChannelController.getUserChannels')
  Route.post('/', 'ChannelController.join')
  Route.post('/create', 'ChannelController.create') // TODO we do not need this endpoint only for testing
  Route.delete('/:id', 'ChannelController.delete')
  Route.post('/leave', 'ChannelController.leave')
  Route.post('/quit', 'ChannelController.quit')
  Route.post('/revoke', 'ChannelController.revoke')
  Route.post('/kick', 'ChannelController.kick')
  Route.get('/:name/users', 'ChannelController.getChannelUsers')
}).prefix('channels').middleware('auth')

Route.group(() => {
  Route.post('/', 'HTTPInvitesController.addInvite')
  Route.post('/accept', 'HTTPInvitesController.acceptInvite')
  Route.post('/decline', 'HTTPInvitesController.declineInvite')
}).prefix('invite').middleware('auth')

Route.group(() => {
  Route.post('/change-status', 'UserController.updateStatus')
}).prefix('user').middleware('auth')
