import {BootParams, SocketManager} from "src/services/SocketManager";
import {SerializedChannel} from "src/contracts/Channel";


class InvitesSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {

    this.socket.on('invite', (channel: SerializedChannel) => {
      store.commit('invites/NEW_INVITE', channel)
    })
  }

  public loadInvites (): Promise<SerializedChannel[]> {
    return this.emitAsync('loadMessages')
  }
}

class InvitesService {
  private socket: InvitesSocketManager = new InvitesSocketManager('/invites')

  public join(): InvitesSocketManager {
    return this.socket
  }
}

export default new InvitesService()
