<template>
  <div :class="['chat', { 'mine': isMine, 'others': !isMine }]">
    <div class="row items-center q-pl-sm">
      <div class="col-auto justify-center">
        <img src="../assets/user-img.png" alt="User Image" class="user-image" />
      </div>
      <div class="col q-py-sm ">
        <div class="row  q-pt-xs name">
          <p>{{ message.author.email }}</p>
        </div>
        <div class="row q-pr-sm text-left q-pl-sm">
          {{ message.content }}
        </div>
        <div class="row-auto timestamp float-right q-pt-sm">
          {{ formatDate(message.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent, PropType } from 'vue'
import { SerializedMessage } from 'src/contracts'
// //#36454F to ked oznaceny
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
    formatDate (dateString) {
      // Ensure message.created_at is a valid Date
      const date = new Date(dateString)
      return date.toLocaleString()
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
  background-color: #1D1D1D;
  text-align: left;
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
