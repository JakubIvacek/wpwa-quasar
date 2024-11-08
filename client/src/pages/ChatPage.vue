<template>
  <q-page class="q-pa-sm flex-column full-height justify-center">
    <div class="row absolute-top channelName">
      {{ channelName }}
    </div>
    <q-page class="row items-center justify-evenly">
      <channel-messages-component :messages="messages" />
    </q-page>
    <q-footer class="bg-dark">
      <CommandLine @sendMessage="handleSendMessage"  users=""/>
    </q-footer>
  </q-page>
</template>

<script lang="ts">
import ChannelMessagesComponent from 'src/components/ChannelMessage.vue'
import { SerializedMessage } from 'src/contracts'
import { defineComponent } from 'vue'
import CommandLine from "components/CommandLine.vue"
import ChatBubble from "components/ChatBubble.vue"

export default defineComponent({
  components: { CommandLine, ChannelMessagesComponent },
  name: 'ChannelPage',
  computed: {
    messages (): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages']
    }
  }
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
