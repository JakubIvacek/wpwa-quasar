<template>
  <q-item
    clickable
    tag="a"
    :to="`/home/${channelId}`"
    class="text-white"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChannelLink',
  props: {
    channelId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: ''
    },
    messages: {
      type: Array as () => Array<{ id: string, user: string, message: string }>,
      default: () => []
    }
  }
})

</script>
