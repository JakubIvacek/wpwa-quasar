<template>
  <q-page class="q-pa-sm flex-column full-height justify-center">
    <!-- NO CHANNEL SELECTED MESSAGE -->
    <div v-if="!channelId" class="flex full-height justify-center items-center">
      <q-card class="q-pa-md ">
        <q-card-section class="text-center">
          <q-icon name="chat" size="80px" color="grey-7" />
          <div class="text-h5 q-mt-md q-mb-md text-weight-bold">NO CHANNEL OPENED</div>
          <div class="text-h6 q-mt-md">Open one of your channels or create new one</div>
          <div class="text-h6 q-mt-md">by typing /join 'name'</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- DISPLAY CHAT -->
    <div v-else>
      <div class="row absolute-top channelName">
        {{ channelName }}
      </div>
      <q-scroll-area ref="chatArea" class="box" @scroll="handleScroll">
        <q-infinite-scroll
          @load="onLoad"
          reverse
          :offset="0"
          :disable="!hasMoreMessages"
          ref="scrollContainer">
          <template v-slot:loading>
            <div class="row justify-center q-my-md" style="width: 100%">
              <q-spinner color="primary" name="dots" size="40px" />
            </div>
          </template>

          <!-- Show button only if items > 20 and hasScrolled is true -->
          <div v-if="items.length > 20 && hasScrolled" class="custom-icon-back">
            <q-btn
              color="primary"
              icon="arrow_downward"
              round
              @click="scrollToBottom"
            />
          </div>

          <div v-for="(item, index) in items" :key="index" class="chat-container row">
            <ChatBubble
              class="hover-grey chat"
              :id="item.id"
              :user="item.user"
              :message="item.message"
              :timestamp="('2024-11-14 14:45:34')"
            />
          </div>
        </q-infinite-scroll>
      </q-scroll-area>
      <div class="row absolute-bottom q-pl-md text-weight-bold items-center" style="margin-bottom: 3px">
        <div class="col-auto q-pr-sm">
          <q-spinner-dots color="white" size="20px"/>
        </div>
        <div class="col">
          User Typing
        </div>
      </div>
    </div>

    <q-footer class="bg-dark">
      <CommandLine @sendMessage="handleSendMessage" />
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import { QScrollArea } from 'quasar'
import ChatBubble from 'components/ChatBubble.vue'
import { channelList } from 'src/channels'
import { useRoute } from 'vue-router'
import CommandLine from 'components/CommandLine.vue'

const route = useRoute()
const channelId = computed(() => route.params.channelId)
const chatArea = ref<QScrollArea | null>(null)
const hasScrolled = ref(false)
interface ChatItem {
  id: string;
  user: string;
  message: string;
}
const chatMessages = ref<ChatItem[]>([])
const hasMoreMessages = ref(true)
const items = ref<ChatItem[]>([])
const channelName = ref<string>('')

const scrollToBottom = () => {
  nextTick(() => {
    const chatAreaElement = chatArea.value && chatArea.value.$el.querySelector('.q-scrollarea__container')
    if (chatAreaElement) {
      chatAreaElement.scrollTo({
        top: chatAreaElement.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}
// Handle the message received from CommandLine.vue
const handleSendMessage = (message: ChatItem) => {
  const channel = channelList.find(c => c.channelId === channelId.value)
  if (channel) {
    items.value.push(message)
    channel.messages.unshift(message)
    scrollToBottom()
  }
}

function setChatMessages () {
  const channel = channelList.find(c => c.channelId === channelId.value)
  chatMessages.value = channel ? channel.messages : []
  channelName.value = channel?.title
}

const onLoad = (index: number, done: () => void) => {
  setTimeout(() => {
    setChatMessages()
    const currentLength = items.value.length
    if (chatMessages.value.length === 0) {
      console.warn('No messages to load.')
      hasMoreMessages.value = false // Disable loading if no messages
      done()
      return
    }
    let counter = 0
    for (const message of chatMessages.value.slice(currentLength)) {
      if (counter < 15 && currentLength + counter < chatMessages.value.length) {
        items.value.unshift(message)
        counter += 1
      } else {
        break
      }
    }
    hasMoreMessages.value = items.value.length < chatMessages.value.length
    done()
  }, 800)
}
const handleScroll = () => {
  const chatAreaElement = chatArea.value?.$el.querySelector('.q-scrollarea__container')
  if (chatAreaElement) {
    // Check if scrolled away from the bottom by 300 pixels
    const isNearBottom = (chatAreaElement.scrollHeight - chatAreaElement.scrollTop - chatAreaElement.clientHeight) <= 300
    hasScrolled.value = !isNearBottom
  }
}
watch(channelId, () => {
  items.value = []
  onLoad(0, () => {})
  scrollToBottom()
})
</script>

<style scoped>
.channelName {
  font-size: 32px;
  font-weight: bold;
  padding: 20px;
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
  padding: 1px; /* Padding okolo chat bubliny */
}

.box {
  padding-top: 40px;
  height: 70vh;
  margin: 15px 10px 10px 10px;
}
@media (min-height: 1000px) {
  .box {
    padding-top: 50px;
    height: 81vh;
    margin: 15px 10px 10px 10px;
  }
}
.chat-container {
  height: 100%;
  width: 100%;
}
.custom-icon-back{
  width: 100%;
  position: sticky;
  top: 10px;
  text-align: center;
  z-index: 9;
}
</style>
