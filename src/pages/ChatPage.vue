<template>
  <q-page class="q-pa-sm" style="height: 77vh">
    <q-scroll-area style="height: 100%">
      <div class="chat-container">
        <ChatBubble class="hover-grey chat" v-for="chat in chatMessages" :id="chat.id" :user="chat.user" :message="chat.message" />
      </div>
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
import {computed, nextTick, ref} from 'vue'
import { uid } from 'quasar'
import ChatBubble from 'components/ChatBubble.vue'
import { channelList } from 'src/channels'
import { useRoute } from 'vue-router'

const route = useRoute()
const channelId = computed(() => route.params.channelId)

const chatMessages = computed(() => {
  const channel = channelList.find(c => c.channelId === channelId.value)
  return channel ? channel.messages : []
})

const message = ref<string>('')

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollArea.value) {
      scrollArea.value.setScrollPosition('end')
    }
  })
}

const commandLineReset = () => {
  message.value = ''
}

const isSendDisabled = computed(() => {
  return message.value.trim() === ''
})

const sendMessage = ():void => {
  const newMessage = Object.assign({}, { user: 'Pety', id: uid(), message: message.value })
  const channel = channelList.find(c => c.channelId === channelId.value)
  if (channel) {
    channel.messages.push(newMessage)
    scrollToBottom()
  }
}

function startsWithSlash(): boolean {
  return message.value.startsWith('/');
}

function addChannel(): void {
  const parts = message.value.split(' ')
  const newChannel = Object.assign({}, {channelId: uid(), title: parts.slice(1).join(' '), icon: 'tag', messages: []})
  channelList.push(newChannel)
}

const validateCommandInput = (): void => {
    if (startsWithSlash()){
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
</script>

<style scoped>
.chat-container {
  padding: 5px; /* Padding okolo kontajnera */
  overflow-y: auto;
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
</style>
