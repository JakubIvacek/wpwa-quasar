<template>
  <q-dialog v-model="isVisible">
    <q-card style="width: 350px">
      <q-card-section>
        <div class="text-h5">Channel Users</div>
      </q-card-section>
        <q-list>
          <q-item
            v-for="user in props.users"
            class="text-weight-bold items-center hover-grey"
          >
            {{ user.username }}
          </q-item>
        </q-list>
      <q-card-actions align="right">
        <q-btn flat label="Exit" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

const props = defineProps<{
  users: string[];
}>();

const isVisible = ref(false);
</script>

<style scoped>
.hover-grey {
  transition: background-color 0.3s ease; /* Prechod pre hover efekt */
}
.hover-grey:hover {
  background-color: rgba(240, 240, 240, 0.26);
}
</style>
