<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 600px; max-height: 500px; overflow-y: auto">
      <q-card-section class="text-center">
        <div class="text-h4">Channel Users - {{ channelName }}</div>
      </q-card-section>

      <q-card-section>
        <q-list bordered>
          <q-item v-for="user in channelUsers" :key="user.id" class="user-item">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>{{ user.name }}</q-item-section>
            <q-item-section side>
              <q-badge :color="user.status === 'online' ? 'green' : user.status === 'offline' ? 'red' : 'orange'" class="q-ml-sm" rounded />
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
export default {
  name: 'UsersListComponent',
  props: {
    modelValue: Boolean,
    channelUsers: Array,
    channelName: String
  },
  emits: ['update:modelValue'],
  data() {
    return {
      dialogVisible: this.modelValue
    };
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:modelValue', val);
    }
  }
};
</script>

<style scoped>
.user-item:hover {
  background-color: rgba(74, 74, 74, 0.59);
}
</style>
