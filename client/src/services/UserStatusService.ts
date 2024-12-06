import {AxiosError} from "axios";
import {api} from "boot/axios";
import {Notify} from "quasar";

class UserStatusService {
  public async updateUserStatus(status: string): Promise<void> {
    try {
      await api.post('user/change-status', { status })

      Notify.create({
        type: "positive",
        message: "User status updated successfully!",
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error updating user status:', axiosError.response?.data || axiosError.message)

      Notify.create({
        type: "negative",
        message: "Failed to update user status. Please try again.",
      });

      throw error
    }
  }
}

export default new UserStatusService()
