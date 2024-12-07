<template>
  <div class="q-ml-xl text-weight-bold q-mt-sm " style="width: 80%; font-size: 2rem;">
    <pre v-if="activeChannel"> {{ activeChannel}} </pre>
  </div>
  <div class="q-pa-md">
    <q-infinite-scroll @load="onLoad" reverse>
      <template v-slot:loading>
        <div class="row justify-center q-my-md" v-if="loading">
          <q-spinner color="primary" name="dots" size="40px" />
        </div>
      </template>

      <div style="width: 100%; max-width: 95%; margin: 0 auto;">
        <!-- Display messages only if there is an active channel -->
        <template v-if="activeChannel">
          <ChatBubble
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :isMine="isMine(message)"
          />
        </template>
        <!-- If no active channel, you can also add a placeholder for chat content -->
        <template v-else>
          <q-card class="q-pa-md q-pt-xl q-mt-md" flat>
            <q-card-section class="text-center">
              <q-icon name="chat" size="150px" color="cyan-10" />
              <div class="text-h4 q-mt-md q-mb-md text-weight-bold">NO CHANNEL OPENED</div>
              <div class="text-h5 q-mt-md">Open one of your channels or create new one</div>
              <div class="text-h5 q-mt-md">by typing /join 'name'</div>
            </q-card-section>
          </q-card>
        </template>
      </div>
    </q-infinite-scroll>
  </div>
</template>

<script lang="ts">
import { QScrollArea } from "quasar"
import { SerializedMessage } from "src/contracts"
import { defineComponent, PropType } from "vue"
import ChatBubble from "components/ChatBubble.vue"

export default defineComponent({
  name: "ChannelMessage",
  components: { ChatBubble },
  data () {
    return {
      messages: [] as SerializedMessage[],  // Array of messages
      page: 1,  // Page number for infinite scrolling
      loading: false,  // Loading state to prevent redundant fetches
      hasMoreMessages: true,  // Whether there are more messages to load
    }
  },
  watch: {
    activeChannel(newChannel, oldChannel) {
      // Reset messages and page when the active channel changes
      if (newChannel !== oldChannel) {
        this.messages = []
        this.page = 1
        this.hasMoreMessages = true
        this.fetchMessages(newChannel)
      }
    }
  },
  computed: {
    activeChannel () {
      return this.$store.state.channels.active  // Active channel from the store
    },
    currentUser () {
      return this.$store.state.auth.user?.id  // Current user id
    }
  },
  methods: {
    // Method to check if the message was sent by the current user
    isMine (message: SerializedMessage): boolean {
      return message.author.id === this.currentUser
    },

    // Fetch messages for the current active channel
    async fetchMessages (channel: string) {
      if (this.loading || !this.hasMoreMessages) return
      this.loading = true

      try {
        const newMessages = await this.$store.dispatch('channels/fetchMessages', { channel, page: this.page })
        if (newMessages.length > 0) {
          this.messages = [...newMessages, ...this.messages]  // Prepend new messages
          this.page += 1
        } else {
          this.hasMoreMessages = false  // No more messages to load
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        this.loading = false
      }
    },

    // Infinite scroll handler for the load event
    onLoad () {
      if (this.activeChannel) {
        this.fetchMessages(this.activeChannel)
      }
    },

    // Adjust scroll to maintain position or handle it appropriately
    scrollMessages () {
      const area = this.$refs.area as QScrollArea
      if (area) {
        area.setScrollPercentage('vertical', 1.5)
      }
    }
  },

  async mounted () {
    // Initial fetch when the component is mounted
    if (this.activeChannel) {
      this.fetchMessages(this.activeChannel)
    }
  }
})
</script>

