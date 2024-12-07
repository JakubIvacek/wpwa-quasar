<template>
  <q-page class="row items-center justify-evenly">
    <channel-messages-component />
  </q-page>
</template>

<script lang="ts">
import ChannelMessagesComponent from 'src/components/ChannelMessage.vue'
import { SerializedMessage } from 'src/contracts'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {ChannelMessagesComponent},
  name: 'ChatPage',
  data() {
    return {
      messages: [] as SerializedMessage[], // Store messages here
    };
  },
  computed: {
    activeChannel() {
      return this.$store.state.channels.active; // Access the active channel from the store
    }
  },
  watch: {
    activeChannel(newChannel) {
      // When the active channel changes, fetch new messages
      this.fetchMessages(newChannel);
    }
  },
  methods: {
    async fetchMessages(channel: string) {
      // Dispatch the fetchMessages action when the active channel changes
      this.messages = await this.$store.dispatch('channels/fetchMessages', { channel, page: 1 });
    }
  },
  async mounted() {
    // Initial fetch when the component is mounted
    this.fetchMessages(this.activeChannel);
  }
})
</script>
