<template>
  <div class="q-ml-lg text-weight-bold" style="width: 100%; font-size: 1.2rem;">
    {{activeChannel}}
  </div>
  <q-scroll-area ref="area" style="width: 100%; height: calc(100vh - 151px)">
    <div style="width: 100%; max-width: 95%; margin: 0 auto;">
      <ChatBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :isMine="isMine(message)"
      />
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { QScrollArea } from "quasar"
import { SerializedMessage } from "src/contracts"
import { defineComponent, PropType } from "vue"
import ChatBubble from "components/ChatBubble.vue"

export default defineComponent({
  name: "ChannelMessage",
  components: { ChatBubble },
  props: {
    messages: {
      type: Array as PropType<SerializedMessage[]>,
      default: () => []
    }
  },
  watch: {
    messages: {
      handler () {
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    }
  },
  computed: {
    activeChannel () {
      return this.$store.state.channels.active
    },
    currentUser () {
      return this.$store.state.auth.user?.id
    }
  },
  methods: {
    scrollMessages () {
      const area = this.$refs.area as QScrollArea
      area && area.setScrollPercentage('vertical', 1.5)
    },
    isMine (message: SerializedMessage): boolean {
      return message.author.id === this.currentUser
    }
  }
})
</script>
