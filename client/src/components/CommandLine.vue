<template>
  <q-footer class="bg-dark justify-end">
    <q-form @submit="send " class="width">
      <div class="row q-my-md q-ml-sm">
        <div class="col q-ml-xl q-mr-md">
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

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import {SerializedChannel} from "src/contracts/Channel";

export default defineComponent({
  name: 'ChatLayout',
  data () {
    return {
      leftDrawerOpen: false,
      message: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      lastMessageOf: 'lastMessageOf'
    }),
    activeChannel () {
      return this.$store.state.channels.active
    },
    currentUser () {
      return this.$store.state.auth.user?.id
    }
  },
  methods: {
    async send () {
      if (this.startsWithSlash()) {
        switch (this.message.value.split(' ')[0]) {
          case '/join':
            var parts: string[] = this.message.split(' ')
            await this.addChannel({ channelName: parts[1], typeChat: parts[2], creatorId: this.currentUser })
            break
          case '/list':
            // showUserList()
            break
        }
      } else {
        this.loading = true
        await this.addMessage({ channel: this.activeChannel, message: this.message })
        this.message = ''
        this.loading = false
      }
    },
    startsWithSlash (): boolean {
      return true // this.message.value.startsWith('/')
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage', 'addChannel'])
  }
})
</script>

<style scoped>
  .width{
    width: 95%;
  }
</style>
