<template>
  <q-dialog v-model="settings" @show="updateUserStatusRef">
    <q-card style="width: 400px">
      <q-card-section class="text-center">
        <div class="text-h5">Settings</div>
      </q-card-section>
      <div class="q-pa-md">
        <div class="row q-gutter-sm justify-center">
          <q-radio v-model="userStatusRef" val="online" label="Online" color="green"/>
          <q-radio v-model="userStatusRef" val="offline" label="Offline" color="red"/>
          <q-radio v-model="userStatusRef" val="dnd" label="DND" color="orange"/>
        </div>
        <div class="q-mt-md">
          <h5 class="text-center q-mb-sm">Notifications</h5>
          <div class="row justify-center items-center">
            <span class="q-mr-sm">Only Addressed</span>
            <q-toggle
              v-model="notificationRef"
              color="cyan-10"
              icon="mail"
            />
            <span class="q-ml-sm">All Notifications</span>
          </div>
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn flat label="Save" color="cyan-10" @click="updateStatus" v-close-popup />
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
      notificationRef: true,
      settings: this.modelValue,
      userStatusRef: ref(''),
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
      userStatus: 'auth/userStatus',
      allNotifications: 'auth/allNotifications'
    })
  },
  methods: {
    ...mapActions('auth', ['updateUserStatus', 'updateNotifications']),
    updateUserStatusRef() {
      this.userStatusRef = this.userStatus;
      this.notificationRef = this.allNotifications;
    },
    async updateStatus() {
      if (this.userStatusRef !== this.userStatus){
        await this.updateUserStatus(this.userStatusRef);
      }

      if (this.notificationRef !== this.allNotifications){
        await this.updateNotifications(this.notificationRef);
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
