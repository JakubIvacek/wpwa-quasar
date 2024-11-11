import {BootParams, SocketManager} from "src/services/SocketManager";
import {SerializedChannel} from "src/contracts/Channel";
import {api} from "boot/axios";
import {AxiosError} from "axios";


class InvitesSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {

    this.socket.on('invite', (channel: SerializedChannel) => {
      store.commit('invites/NEW_INVITE', channel)
    })
  }

  public loadInvites (): Promise<SerializedChannel[]> {
    return this.emitAsync('loadInvites')
  }
}

class InvitesService {
  private socket!: InvitesSocketManager

  public join(name:string): InvitesSocketManager {
    this.socket = new InvitesSocketManager(`/invites/${name}`)
    return this.socket
  }

  public leave (): void {

    // disconnect namespace and remove references to socket
    this.socket.destroy()
  }

  public async sendInvite(senderId: number, receiverName: string, channelName: string): Promise<void> {
    try {
      await api.post('invite/', {
        senderId: senderId,
        receiverName: receiverName,
        channelName: channelName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Error joining channel:', axiosError.response.data);
        } else {
          console.error('Error joining channel:', axiosError.message);
        }
    }
  }

  public async acceptInvite(receiverName: string, channelName: string): Promise<void> {
    try {
      await api.post('invite/accept', {
        receiverName: receiverName,
        channelName: channelName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error joining channel:', axiosError.response.data);
      } else {
        console.error('Error joining channel:', axiosError.message);
      }
    }
  }
}



export default new InvitesService()
