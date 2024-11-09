<template class="bg-dark">
  <div class="position-relative bg-dark" :style="{ height: $q.screen.height + 'px' }">
    <q-layout view="hHh LpR lFf">
      <q-header class="bg-img">
        <q-toolbar class="text-white">
          <q-btn
            round
            flat
            color="black"
            :icon="leftDrawerOpen ? 'keyboard_arrow_left' : 'keyboard_arrow_right'"
            class="WAL__drawer-open q-mr-sm"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-avatar class="img-own q-ma-sm">
            <img src="../assets/logo-white.png" alt="logo" class="bg-primary" >
          </q-avatar>

          <q-toolbar-title class="text-weight-bold text-h4 title ">
            ChatterBox
          </q-toolbar-title>
          <span class="q-subtitle-1 q-pl-md text-weight-bold custom-show">
            {{ activeUser }}
          </span>
          <div class="q-mx-sm">
            <q-btn round color="primary" icon="settings"  @click="settings = true"/>
          </div>
          <div class="q-mx-sm">
            <q-btn round color="negative" icon="logout" @click="logout"/>
          </div>
        </q-toolbar>
        <settings-modal v-model="settings" />
      </q-header>
      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-dark text-white text-weight-bold q-pt-sm q-pl-lg" style="font-size: 25px">
          Channels
          <q-space />
        </q-toolbar>
        <q-scroll-area class="bg-dark" style="height: calc(100% - 50px)">
          <q-list  bordered dark class="q-mt-sm">
            <q-item
              v-for="(channel, index) in channels"
              :key="index"
              clickable
              v-ripple
              class="text-white"
              @click="setActiveChannel(channel)"
            >
              <q-item-section>
                <q-item-label lines="1" class="channel-label">
                  {{ channel }}
                </q-item-label>
                <q-item-label class="conversation__summary">
                  {{ getShortMessage(lastMessageOf(channel)?.content) }}
                </q-item-label>
              </q-item-section>

              <!--              <q-item-section side>-->
              <!--                &lt;!&ndash;q-item-label caption>-->
              <!--                  {{ channel }}-->
              <!--                </q-item-label&ndash;&gt;-->
              <!--              </q-item-section>-->
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="bg-dark">
        <router-view />
      </q-page-container>

      <q-footer class="q-ml-sm">
        <q-toolbar class="bg-dark row">
          <q-input
            v-model="message"
            :disable="loading"
            @keydown.enter.prevent="send"
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            input-class="text-black"
            bg-color="white"
            placeholder="Type a message"
            />
          <q-btn :disable="loading" @click="send" round flat color="white" icon="send" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SettingsModal from 'components/SettingsModal.vue'
import {CreateChannel} from "src/contracts/Channel";

export default defineComponent({
  name: 'MainLayout',
  components: { SettingsModal },
  data () {
    return {
      leftDrawerOpen: false,
      message: '',
      loading: false,
      settings: false
    }
  },
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      lastMessageOf: 'lastMessageOf'
    }),
    activeChannel (): string | null {
      return this.$store.state.channels.active
    },
    activeUser (): string | undefined {
      return this.$store.state.auth.user?.email
    },
    activeUserId () {
      return this.$store.state.auth.user?.id
    }
  },
  methods: {
    async send () {
      if (this.startsWithSlash()) {
        var parts = this.message.split(' ')
        console.log(parts)
        switch (parts[0]) {
          case '/join':
            var newChannel: CreateChannel = {
              name: parts[1],
              type: parts[2],
              creator_id: this.activeUserId

            }
            await this.addChannel(newChannel)
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
      return this.message[0] === '/'
    },
    getShortMessage (content:string):string {
      if (content) {
        return content.slice(0, 25) + "..." // Zobrazí len prvých 25 znakov
      }
      return ''
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage', 'addChannel'])
  }
})
</script>
<style>
.item-channel{
  border:white
}
@media(max-width: 650px){
  .custom-show{
    display: none;
  }
}
</style>
<style lang="sass">
.channel-label
  font-size: 1.1rem
  font-weight: bold

.bg-img
  background-image: url('../assets/bg-img.jpg')
  background-size: cover
  background-position: top
.WAL
  width: 100%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px
  &:before
    content: ''
    height: 127px
    position: fixed
    top: 0
    width: 100%
    background-color: #009688
  &__layout
    margin: 0 auto
    z-index: 4000
  &__field.q-field--outlined .q-field__control:before
    border: none
@media (max-width: 850px)
  .WAL
    padding: 0
    &__layout
      width: 100%
      border-radius: 0
.conversation__summary
  margin-top: 4px
.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
</style>
