<template>
  <q-footer class="bg-dark">
    <q-form @submit="send">
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

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
    }
  },
  methods: {
    async send () {
      this.loading = true
      await this.addMessage({ channel: this.activeChannel, message: this.message })
      this.message = ''
      this.loading = false
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage'])
  }
})
</script>

<style scoped>

</style>
