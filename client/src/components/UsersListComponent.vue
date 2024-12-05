<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 600px; max-height: 500px; overflow-y: auto">
      <q-card-section class="text-center">
        <div class="text-h4">Channel Users</div>
      </q-card-section>

      <q-card-section>
        <q-list bordered>
          <q-item v-for="user in channelUsers" :key="user.id" class="user-item" clickable="false">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>{{ user.name }}</q-item-section>
            <q-item-section side>
              <q-badge :color="user.status === 'online' ? 'green' : user.status === 'offline' ? 'orange' : 'red'" class="q-ml-sm" rounded />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Exit" color="blue" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SettingsModal',
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dialogVisible = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });

    const channelUsers = [
      {
        id: 1,
        name: 'User 1',
        status: 'online'
      },
      {
        id: 2,
        name: 'User 2',
        status: 'offline'
      },
      {
        id: 3,
        name: 'User 3',
        status: 'DND'
      },
      {
        id: 1,
        name: 'User 1',
        status: 'online'
      },
      {
        id: 2,
        name: 'User 2',
        status: 'offline'
      },
      {
        id: 3,
        name: 'User 3',
        status: 'DND'
      }
    ];

    return {
      dialogVisible,
      channelUsers
    };
  }
});
</script>

<style scoped>
.user-item:hover {
  background-color: rgba(74, 74, 74, 0.59);
}
</style>
