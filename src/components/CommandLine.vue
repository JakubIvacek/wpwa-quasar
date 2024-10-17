<template>
  <q-footer class="bg-dark">
    <q-form @submit="validateCommandInput">
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { uid } from 'quasar'
import { channelList } from 'src/channels'
import { useRouter } from "vue-router";

// Emit function to send data to parent
const emit = defineEmits(['sendMessage'])

const message = ref<string>('')

const isSendDisabled = computed(() => {
  return message.value.trim() === ''
})

function startsWithSlash (): boolean {
  return message.value.startsWith('/')
}

const router = useRouter()

function addChannel (): void {
  const parts = message.value.split(' ')
  const newChannel = Object.assign({}, {
    channelId: uid(),
    title: parts.slice(1).join(' '),
    icon: 'tag',
    messages: []
  })
  channelList.push(newChannel)

  router.push({path: `home/${newChannel.channelId}`})
}

const validateCommandInput = (): void => {
  if (startsWithSlash()) {
    switch (message.value.split(' ')[0]) {
      case '/join':
        addChannel()
        break
      default:
        sendMessage()
    }
  } else {
    sendMessage()
  }
  commandLineReset()
}

// Emit the message to the parent component
const sendMessage = (): void => {
  emit('sendMessage', {
    id: uid(),
    user: 'Pety',
    message: message.value
  })
}

const commandLineReset = () => {
  message.value = ''
}
</script>

<style scoped>

</style>
