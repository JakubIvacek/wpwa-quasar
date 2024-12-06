import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
// import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import {UserStatus} from "App/Enums/UserStatus";

export default class AuthController {
  async register({ request, response }: HttpContextContract) {
    // Validate incoming request data
    const data = await request.validate(RegisterUserValidator);

    // Set default status to 'offline'
    const userData = {
      ...data,
      status: UserStatus.OFFLINE, // Default status set to offline
    };

    // Create user in the database
    try {
      return await User.create(userData); // Return created user
    }catch (error){
      if (error.code === '23505') {
          return response.status(400).json({ error: 'User with this name already exists' });
      }
    }
  }

  async login({ auth, request }: HttpContextContract) {
    // Retrieve nickname and password from request
    const nickname = request.input('nickname');
    const password = request.input('password');

    // Find the user by nickname
    const user = await User.findByOrFail('nickname', nickname);

    // Attempt authentication using the user's ID and password
    return auth.use('api').attempt(user.email, password);
  }

  async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels')
    return auth.user
  }
}

