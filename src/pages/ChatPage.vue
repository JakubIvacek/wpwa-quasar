<template>
  <q-page>
    <div class="q-pa-md">
      <q-list>
        <q-item v-for="chat in chatMessages" :key="chat.id" class="hover-grey">
          <q-item-section>
            <ChatBubble :id="chat.id" :user="chat.user" :message="chat.message" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-footer
      class="bg-transparent"
    >
      <div class="row q-gutter-md q-mr-lg q-my-md">
        <div class="col q-ml-xl">
          <q-input
            v-model="input"
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
            round />
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import ChatBubble from "components/ChatBubble.vue";

const chatMessages = ref([
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  }
])
</script>

<style>
.hover-grey:hover {
  background-color: rgba(240, 240, 240, 0.26);

  transition: background-color 0.3s ease;
}
</style>/
