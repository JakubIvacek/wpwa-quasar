import { RawMessage, SerializedMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import { api } from "boot/axios"
import { CreateChannel, SerializedChannel } from "src/contracts/Channel"

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channel, message })
    })
  }

  public addMessage (message: RawMessage): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message)
  }

  public loadMessages (): Promise<SerializedMessage[]> {
    return this.emitAsync('loadMessages')
  }
}

class ChannelService {
  private channels: Map<string, ChannelSocketManager> = new Map()

  public join (name: string): ChannelSocketManager {
    if (this.channels.has(name)) {
      throw new Error(`User is already joined in channel "${name}"`)
    }

    // connect to given channel namespace
    const channel = new ChannelSocketManager(`/channels/${name}`)
    this.channels.set(name, channel)
    return channel
  }

  public leave (name: string): boolean {
    const channel = this.channels.get(name)

    if (!channel) {
      return false
    }

    // disconnect namespace and remove references to socket
    channel.destroy()
    return this.channels.delete(name)
  }

  public in (name: string): ChannelSocketManager | undefined {
    return this.channels.get(name)
  }

  async createChannel (newChannel: CreateChannel): Promise<void> {
    try {
      console.log(newChannel)
      const response = await api.post<SerializedChannel>('channels/create', newChannel, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
      console.log('Channel created:', response.data)
    } catch (error) {
      console.error('Error creating channel:', error.response?.data || error.message);
    }
  }

  async getUserChannels (id: number): SerializedChannel[] {
    try {
      const response = await api.get<SerializedChannel[]>(
        `channels/${id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching channels:', error.response?.data || error.message)
      throw error
    }
  }
}

export default new ChannelService()
