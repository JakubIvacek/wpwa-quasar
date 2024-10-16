<template>
  <q-page class="q-pa-sm flex-column full-height">
    <q-scroll-area ref="chatArea"  class="box">
      <q-infinite-scroll @load="onLoad" reverse :offset="0" class="own-padding"  :disable="!hasMoreMessages">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div v-for="(item, index) in items" :key="index" class="chat-container2">
          <ChatBubble
            class="hover-grey chat"
            :id="item.id"
            :user="item.user"
            :message="item.message"
          />
        </div>
      </q-infinite-scroll>
    </q-scroll-area>
    <q-footer class="bg-dark">
      <q-form @submit="validateCommandInput">
        <div class="row q-gutter-md q-mr-lg q-my-md">
          <div class="col q-ml-xl">
            <q-input
              v-model="message"
              bg-color="grey-9"
              placeholder="Command Line"
              outlined
              dense
            />
          </div>
          <div class="col col-auto">
            <q-btn
              color="primary"
              icon="send"
              type="submit"
              :disabled="isSendDisabled"
              round />
          </div>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import {computed, watch, ref, nextTick} from 'vue'
import {QScrollArea, uid} from 'quasar'
import ChatBubble from 'components/ChatBubble.vue'
import { channelList } from 'src/channels'
import { useRoute } from 'vue-router'

const route = useRoute()
const channelId = computed(() => route.params.channelId)

const message = ref<string>('')
const commandLineReset = () => {
  message.value = ''
}
const chatArea = ref<QScrollArea | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatArea.value) {
      chatArea.value.setScrollPercentage('vertical', 100); // Set to 100 to scroll to the bottom
    }
  });
};

const isSendDisabled = computed(() => {
  return message.value.trim() === ''
})

const sendMessage = ():void => {
  const newMessage = Object.assign({}, { user: 'Pety', id: uid(), message: message.value })
  const channel = channelList.find(c => c.channelId === channelId.value)
  if (channel) {
    items.value.push(newMessage)
    channel.messages.unshift(newMessage)
    scrollToBottom()
  }
}
function startsWithSlash (): boolean {
  return message.value.startsWith('/')
}

function addChannel (): void {
  const parts = message.value.split(' ')
  const newChannel = Object.assign({}, { channelId: uid(), title: parts.slice(1).join(' '), icon: 'tag', messages: [] })
  channelList.push(newChannel)
}

const validateCommandInput = (): void => {
  if (startsWithSlash()) {
    switch (message.value.split(' ')[0]) {
      case '/join':
        addChannel()
        break
      default:
        sendMessage()
    }
  } else {
    sendMessage()
  }
  commandLineReset()
}
interface ChatItem {
  id: string;
  user: string;
  message: string;
}
const chatMessages = ref<ChatItem[]>([])
const hasMoreMessages = ref(true)

function setChatMessages () {
  const channel = channelList.find(c => c.channelId === channelId.value)
  chatMessages.value = channel ? channel.messages : []
}

const items = ref<ChatItem[]>([])
const onLoad = (index: number, done: () => void) => {
  setTimeout(() => {
    setChatMessages()
    let first: boolean = false
    if (items.value.length === 0) {
      first = true
    }
    const currentLength = items.value.length
    if (chatMessages.value.length === 0) {
      console.warn('No messages to load.')
      hasMoreMessages.value = false // Disable loading if no messages
      done()
      return
    }
    let counter = 0
    for (const message of chatMessages.value.slice(currentLength)) {
      if (counter < 25 && currentLength + counter < chatMessages.value.length) {
        items.value.unshift(message)
        counter += 1
      } else {
        break
      }
    }
    if (first) {
      scrollToBottom()
    }
    hasMoreMessages.value = items.value.length < chatMessages.value.length
    done()
  }, 800)
}
watch(channelId, () => {
  items.value = []
  onLoad(0, () => {})
})
</script>

<style scoped>
.box {
  height: 78vh;
  align-content: end;
}

.box .row.filler {
  flex: 1 1 auto;
}

.box .row.message-container {
  flex: 0 1 auto;
}
.full-height {
  height: 100%
}

.flex-column {
  display: flex;
  flex-direction: column;
}
.hover-grey {
  transition: background-color 0.3s ease; /* Prechod pre hover efekt */
}

.hover-grey:hover {
  background-color: rgba(240, 240, 240, 0.26);
}

.chat {
  padding: 10px; /* Padding okolo chat bubliny */
}
.filler{
  height: 300px;
}
.chat-container2 {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  justify-content: end;
  align-content: end;
}
</style>
