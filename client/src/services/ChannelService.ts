import { RawMessage, SerializedMessage } from 'src/contracts'
import { BootParams, SocketManager } from './SocketManager'
import { api } from "boot/axios"
import { CreateChannel, JoinChannel, RevokeUser, SerializedChannel } from "src/contracts/Channel"
import { ChannelUser } from "src/contracts/ChannelUser"
import { AppVisibility } from 'quasar'
import { AxiosError } from "axios"

// creating instance of this class automatically connects to given socket.io namespace
// subscribe is called with boot params, so you can use it to dispatch actions for socket events
// you have access to socket.io socket using this.socket
class ChannelSocketManager extends SocketManager {
  public subscribe ({ store }: BootParams): void {
    const channel = this.namespace.split('/').pop() as string

    this.socket.on('message', (message: SerializedMessage) => {
      store.commit('channels/NEW_MESSAGE', { channel, message })

      if (!AppVisibility.appVisible){
        this.showNotification(store,message, channel)
      }
    })
  }

  private showNotification(store:any, message: any, channel: string): void {

    const userStatus = store.getters['auth/userStatus']
    const allNotifications = store.getters['auth/allNotifications']

    if (userStatus === 'online') {
      if (allNotifications) {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification(`📢 New message from "${message.author.nickname}" in channel "${channel}"`, {
              body: message.content,
              // icon: 'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification(`📢 New message from "${message.author.nickname}" in channel "${channel}"`, {
                  body: message.content,
                  // icon: 'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
                });
              }
            });
          }
        }
      }else {
        console.log(store.getters['auth/userId'])
        console.log(message.addressed_to)
        if (message.addressed_to === store.getters['auth/userId']) {
          console.log('message addressed to me')
          if ('Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(`📢 New message from "${message.author.nickname}" in channel "${channel}"`, {
                body: message.content,
                // icon: 'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  new Notification(`📢 New message from "${message.author.nickname}" in channel "${channel}"`, {
                    body: message.content,
                    // icon: 'https://cdn.quasar.dev/logo-v2/svg/logo.svg'
                  });
                }
              });
            }
          }
        }
      }
    }
  }

  public fetchMessages (channelName: string, page: number): Promise<SerializedMessage[]> {
    return this.emitAsync('fetchMessages', channelName, page)
  }

  public addMessage (message: RawMessage, addressedTo: string): Promise<SerializedMessage> {
    return this.emitAsync('addMessage', message, addressedTo)
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
      const axiosError = error as AxiosError;
      console.error('Error creating channel:', axiosError.response?.data || axiosError.message)
    }
  }

  async joinChannel (data: CreateChannel) {
    try {
      await api.post('channels/', data, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error joining channel:', axiosError.response?.data || axiosError.message)
    }
  }

  async leaveChannel (data: JoinChannel) {
    try {
      await api.post('channels/leave', data, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error joining channel:', axiosError.response?.data || axiosError.message)
    }
  }

  async revokeUser (data: RevokeUser) {
    try {
      await api.post('channels/revoke', data, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error revoking user :', axiosError.response?.data || axiosError.message)
    }
  }

  async kickUser (data: RevokeUser) {
    try {
      await api.post('channels/kick', data, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error kicking user :', axiosError.response?.data || axiosError.message)
    }
  }

  async quitChannel (data: JoinChannel) {
    try {
      await api.post('channels/quit', data, {
        headers: {
          'Content-Type': 'application/json'// Ensure the correct content type
        }
      })
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error joining channel:', axiosError.response?.data || axiosError.message)
    }
  }

  async getUserChannels (id: number): Promise<SerializedChannel[]> {
    try {
      const response = await api.get<SerializedChannel[]>(
        `channels/${id}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching channels:', axiosError.response?.data || axiosError.message)
      throw error
    }
  }

  async getChannelUsers (name: string): Promise<ChannelUser[]> {
    try {
      const response = await api.get<ChannelUser[]>(
        `channels/${name}/users`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching channels:', axiosError.response?.data || axiosError.message)
      throw error
    }
  }
}

export default new ChannelService()
