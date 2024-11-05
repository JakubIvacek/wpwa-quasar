import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Channel from 'App/Models/Channel'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import {UserStatus} from "App/Enums/UserStatus";
import Channel from "App/Models/Channel";

export default class AuthController {
  async register({ request }: HttpContextContract) {
    // Validate incoming request data
    const data = await request.validate(RegisterUserValidator);

    // Set default status to 'online'
    const userData = {
      ...data,
      status: UserStatus.OFFLINE, // Default status set to online
    };

    // Create user in the database
    const user = await User.create(userData);

    // Join user to general channel
    // const general = await Channel.findByOrFail('name', 'General');
    // await user.related('channels').attach([general.id]);

    return user; // Return created user
  }

  async login({ auth, request }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    return auth.use('api').attempt(email, password)
  }

  async logout({ auth }: HttpContextContract) {
    return auth.use('api').logout()
  }

  async me({ auth }: HttpContextContract) {
    await auth.user!.load('channels')
    return auth.user
  }
}

