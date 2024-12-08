<template>
  <div class="q-ml-xl text-weight-bold q-mt-sm" style="width: 80%; font-size: 2rem;">
    <pre v-if="activeChannel">{{ activeChannel }}</pre>
  </div>

  <q-scroll-area ref="chatArea" style="width: 80%; height: calc(100vh - 250px)">
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
            <div class="text-h5 q-mt-md">Open one of your channels or create a new one</div>
            <div class="text-h5 q-mt-md">by typing /join 'name'</div>
          </q-card-section>
        </q-card>
      </template>
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { QScrollArea } from "quasar";
import { SerializedMessage } from "src/contracts";
import { defineComponent, PropType, nextTick, ref } from "vue";
import ChatBubble from "components/ChatBubble.vue";

export default defineComponent({
  name: "ChannelMessage",
  components: { ChatBubble },
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => [],
    },
  },
  watch: {
    messages: {
      handler () {
        console.log("new message")
        this.scrollToBottom() // Ensure scrolling happens after DOM updates
      },
      deep: true
    },
  },
  computed: {
    activeChannel() {
      return this.$store.state.channels.active;
    },
    currentUser() {
      return this.$store.state.auth.user?.id;
    },
  },
  methods: {
    async scrollToBottom() {
      // Wait for the DOM to be updated
      await nextTick();

      // Make sure chatArea reference is valid and scrollable
      const chatAreaElement = this.$refs.chatArea?.$el?.querySelector('.q-scrollarea__container');

      if (chatAreaElement) {
        chatAreaElement.scrollTo({
          top: chatAreaElement.scrollHeight,
          behavior: 'smooth',
        });
      } else {
        console.error('chatAreaElement not found!');
      }
    },
    isMine(message: SerializedMessage): boolean {
      return message.author.id === this.currentUser;
    },
  },
});
</script>
