<template>
  <q-dialog v-model="settings" @show="updateUserStatusRef">
    <q-card style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-h4">Settings</div>
      </q-card-section>
      <div class="q-pa-md">
        <div class="row q-gutter-sm justify-center">
          <q-radio v-model="userStatusRef" val="online" label="Online" color="cyan-10"/>
          <q-radio v-model="userStatusRef" val="offline" label="Offline" color="cyan-10"/>
          <q-radio v-model="userStatusRef" val="dnd" label="DND" color="cyan-10"/>
        </div>
        <div class="q-mt-md row justify-center">
          <q-toggle
            v-model="notification"
            color="cyan-10"
            icon="mail"
            label="Notification"
          />
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn flat label="Exit" color="cyan-10" @click="updateStatus" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {mapActions, mapGetters} from 'vuex';
import { ref } from 'vue';

export default {
  props: {
    modelValue: Boolean
  },
  data() {
    return {
      notification: true,
      settings: this.modelValue,
      userStatusRef: ref('')
    };
  },
  watch: {
    modelValue(val) {
      this.settings = val;
    },
    settings(val) {
      this.$emit('update:modelValue', val);
    }
  },
  computed: {
    ...mapGetters({
      userStatus: 'auth/userStatus'
    })
  },
  methods: {
    ...mapActions('auth', ['updateUserStatus']),
    updateUserStatusRef() {
      this.userStatusRef = this.userStatus;
    },
    async updateStatus() {
      if (this.userStatusRef !== this.userStatus){
        await this.updateUserStatus(this.userStatusRef);
      }
      this.settings = false;
    }
  },
  mounted() {
    this.updateUserStatusRef();
  }
}
</script>

<style scoped>

</style>
