<template>
  <div :class="['chat', { 'mine': isMine, 'others': !isMine }]">
    <div class="row items-center q-pl-sm">
      <div class="col-auto">
        <img src="../assets/user-img.png" alt="User Image" class="user-image" />
      </div>
      <div class="col q-py-sm">
        <div class="row">
          <strong>{{ message.author.email }}</strong>
        </div>
        <div class="row">
          {{ message.content }}
        </div>
        <div class="row-auto timestamp float-right">
          {{ message.created_at }}
        </div>
      </div>
    </div>
  </div>
</template>

<script  lang="ts">
import { defineComponent, PropType } from 'vue'
import { SerializedMessage } from 'src/contracts'

export default defineComponent({
  props: {
    message: {
      type: Object as PropType<SerializedMessage>,
      required: true
    },
    isMine: {
      type: Boolean,
      default: () => false
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
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-right: 8px;
  padding-left: 3px;
}
.mine {
  background-color: transparent;
  text-align: right;
}
.others {
  background-color: #1D1D1D;
  text-align: left;
}
.timestamp {
  color: darkgray;
  font-size: 12px;
}
</style>
