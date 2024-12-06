import User from "App/Models/User";
import {UserStatus} from "App/Enums/UserStatus";
import {UserRepositoryContract} from "@ioc:Repositories/UserRepository";


export default class UserRepository implements UserRepositoryContract {
  public async updateStatus(userId: number, status: UserStatus): Promise<void> {
    const user = await User.findOrFail(userId);
    user.status = status;
    await user.save();
  }
}
