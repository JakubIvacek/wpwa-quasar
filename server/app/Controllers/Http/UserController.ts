import {inject} from "@adonisjs/core/build/standalone";
import {UserRepositoryContract} from "@ioc:Repositories/UserRepository";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";


@inject(["Repositories/UserRepository"])
export default class UserController {
  constructor(private userRepository: UserRepositoryContract) {}

  public async updateStatus({ request, response }: HttpContextContract): Promise<void> {
    const { userId, status } = request.only(['userId', 'status']);

    if (!userId || !status) {
      return response.status(400).json({ error: 'All fields are required' });
    }

    try {
      await this.userRepository.updateStatus(userId, status);

      return response.status(200).json({ message: 'Status updated' });
    } catch (error) {
      return response.status(500).json({ error: 'Unable to update status' });
    }
  }
}
