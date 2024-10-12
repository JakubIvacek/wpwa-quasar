<template>
  <q-page>
    <q-scroll-area class="chat-list q-pa-md" style="height: 80vh;">
      <q-list>
        <q-item v-for="chat in chatMessages" :key="chat.id" class="hover-grey">
          <q-item-section>
            <ChatBubble :id="chat.id" :user="chat.user" :message="chat.message" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
    <q-footer class="bg-transparent">
      <q-form @submit="sendMessage">
        <div class="row q-gutter-md q-mr-lg q-my-md">
          <div class="col q-ml-xl">
            <q-input
              v-model="message"
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
              :disabled="isSendDisabled"
              round />
          </div>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">

import {computed, ref} from 'vue'
import {uid} from "quasar";
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
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
  {
    id: 1,
    user: 'Pety',
    message: "Ahoj"
  },
  {
    id: 2,
    user: 'Keno',
    message: "Ahoj"
  },
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

const message = ref<string>('');

const commandLineReset = () => {
  message.value = '';
}

const sendMessage = ():void => {
  const newMessage = Object.assign({}, {user: 'Pety', id: uid(), message: message.value});
  chatMessages.value.push(newMessage);
  commandLineReset()
}

const isSendDisabled = computed(() => {
  return message.value.trim() === '';
});

</script>

<style scoped>
.hover-grey:hover {
  background-color: rgba(240, 240, 240, 0.26);

  transition: background-color 0.3s ease;
}
</style>/
