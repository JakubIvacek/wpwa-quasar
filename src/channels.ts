import { reactive } from 'vue'

export const channelList = reactive([
  {
    channelId: '1',
    title: 'Channel 1',
    icon: 'school',
    messages: [
      {
        id: '1',
        user: 'Pety',
        message: 'Ahoj'
      },
      {
        id: '2',
        user: 'Keno',
        message: 'Ahoj'
      },
      {
        id: '1',
        user: 'Pety',
        message: 'Ahoj'
      }
    ]
  },
  {
    channelId: '2',
    title: 'Channel 2',
    icon: 'chat',
    messages: []
  }
])
