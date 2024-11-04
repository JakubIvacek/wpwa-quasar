<template>
  <q-dialog v-model="settings">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h5">Settings</div>
      </q-card-section>
      <div class="q-pa-md">
        <div class="text-h6">Status</div>
        <div class="row q-gutter-sm justify-center">
          <q-radio v-model="userState" val="online" label="Online" />
          <q-radio v-model="userState" val="offline" label="Offline" />
          <q-radio v-model="userState" val="DND" label="DND" />
        </div>
        <div class="q-mt-md row justify-center">
          <q-toggle
            v-model="notification"
            color="primary"
            icon="mail"
            label="Notification"
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
