<template>
  <q-dialog v-model="settings">
    <q-card>
      <q-card-section>
        <div class="text-h5">Settings</div>
      </q-card-section>
      <div class="q-pa-md">
        <div class="text-h6">Status</div>
        <div class="q-gutter-sm">
          <q-radio v-model="userState" val="online" label="Online" />
          <q-radio v-model="userState" val="offline" label="Offline" />
          <q-radio v-model="userState" val="DND" label="DND" />
        </div>
        <div class="row">
          <q-toggle
            v-model="notification"
            color="primary"
            icon="mail"
            label="Turn on/off notification"
          />
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn flat label="Exit" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

export default {
  setup () {
    return {
      userState: ref<string>('online'),
      notification: ref<boolean>(true)
    }
  }
}

const settings = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped>

</style>
