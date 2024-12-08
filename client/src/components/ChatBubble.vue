<template>
  <div :class="['chat', { 'mine': isMine, 'others': !isMine, 'highlighted': addressedToYou(message.addressed_to) }]">
    <div class="row items-center q-pl-sm" @click="handleUnsendClick">
      <div class="col-auto justify-center">
        <img src="../assets/user-img.png" alt="User Image" class="user-image" />
      </div>
      <div class="col q-py-sm">
        <div class="row q-pt-xs name">
          <p>{{ message.author.nickname }}</p>
        </div>

        <!-- Conditional rendering based on 'send' status -->
        <div v-if="message.send === 'unsend'" class="q-pl-lg text-left">
          <q-spinner-dots size="2rem" />
        </div>

        <!-- This shows when the message is sent -->
        <div v-else class="row q-pr-sm text-left q-pl-sm">
          {{ message.content }}
        </div>

        <!-- Timestamp section -->
        <div class="row-auto timestamp float-right q-pt-sm">
          {{ formatDate(message.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { SerializedMessage } from 'src/contracts'

export default defineComponent({
  name: 'ChatBubble',
  props: {
    message: {
      type: Object as PropType<SerializedMessage>,
      required: true
    },
    isMine: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    activeUserId (): number {
      return this.$store.state.auth.user?.id ?? 0
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    addressedToYou (addressedId: number): boolean {
      return this.activeUserId() === addressedId
    },

    // Method to handle the 'unsend' click and toggle message state
    handleUnsendClick () {
      if (this.message.send === 'unsend') {
        this.message.send = 'unsendShown'; // Show spinner after unsending
      } else if (this.message.send === 'unsendShown') {
        this.message.send = 'unsend'; // Go back to 'unsend' state
      }
    }
  }
})
</script>


<style scoped>
.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: white;
}
.chat {
  border-radius: 15px;
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-right: 15px;
  padding-left: 8px;
}
.mine {
  margin-top: 17px;
  background-color: #353839;
  text-align: right;
}
.others {
  margin-top: 17px;
  background-color: #27292B;
  text-align: left;
}
.highlighted {
  background-color: #36454F; /* New background color when addressed to the current user */
  color: white;
}
.timestamp {
  color: darkgray;
  font-size: 0.85em;
}
.name{
  color: ghostwhite;
  font-weight: bold;
  font-size: 1.1em;
}
</style>
