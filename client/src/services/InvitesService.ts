import {BootParams, SocketManager} from "src/services/SocketManager";
import {SerializedChannel} from "src/contracts/Channel";


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
}



export default new InvitesService()
