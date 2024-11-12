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
            {{ activeUserNickname }}
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
          Invites
          <q-space />
          <q-avatar color="red" text-color="white">{{ countInvites }}</q-avatar>
        </q-toolbar>
        <q-scroll-area class="bg-dark"
                       style="height: calc(40% - 100px)">
          <q-list  bordered dark class="q-mt-sm">
            <q-item
              v-for="(invite, index) in invites"
              :key="index"
              class="text-white"
            >
              <q-item-section>
                <q-item-label lines="1" class="channel-label">
                  {{ invite.name }}
                </q-item-label>
              </q-item-section>

              <q-item-section side class="d-flex q-gap-sm">
               <div class="row">
                 <q-btn
                   dense
                   round
                   v-ripple
                   color="primary"
                   icon="check"
                   @click="acceptInviteBtn(invite)"
                 />

                 <q-btn
                   dense
                   round
                   v-ripple
                   color="negative"
                   icon="close"
                   class="q-ml-sm"
                   @click="declineInviteBtn(invite)"
                 />
               </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-toolbar class="bg-dark text-white text-weight-bold q-pt-sm q-pl-lg" style="font-size: 25px">
          Channels
          <q-space />
        </q-toolbar>
        <q-scroll-area class="bg-dark" style="height: calc(60% - 50px)">
          <q-list  bordered dark class="q-mt-sm">
            <q-item
              v-for="(channel, index) in userChannels"
              :key="index"
              clickable
              v-ripple
              class="text-white"
              @click="setActive(channel.name)"
            >
              <q-item-section>
                <q-item-label lines="1" class="channel-label">
                  {{ channel.name }}
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
            @keydown.enter.prevent="handleSend"
            rounded
            outlined
            dense
            class="WAL__field col-grow q-mr-sm"
            input-class="text-black"
            bg-color="white"
            placeholder="Type a message"
            />
          <q-btn
            :disable=isSendDisabled
            @click="send"
            type="submit"
            round
            flat
            color="white"
            icon="send" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SettingsModal from 'components/SettingsModal.vue'
import {SerializedChannel} from "src/contracts/Channel";

export default defineComponent({
  name: 'MainLayout',
  components: { SettingsModal },
  data () {
    return {
      leftDrawerOpen: false,
      message: '',
      loading: false,
      settings: false,
      lastJoinedName: ''
    }
  },
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      lastMessageOf: 'lastMessageOf',
      userChannels: 'getUserChannels'
    }),
    ...mapGetters('invites', {
      invites: 'getInvites'
    }),
    activeChannel (): string | null {
      // console.log(this.$store.state.channels.active)
      return this.$store.state.channels.active
    },
    activeUserNickname (): string | undefined {
      return this.$store.state.auth.user?.nickname
    },
    activeUserId (): number {
      return this.$store.state.auth.user?.id ?? 0
    },
    countInvites (): number {
      return this.invites.length
    },
    isSendDisabled (): boolean {
      return this.message.length === 0 || this.loading
    }
  },
  methods: {
    acceptInviteBtn(invite: SerializedChannel) {
      this.acceptInvite({ invite: invite, userName: this.activeUserNickname })
    },
    declineInviteBtn(invite: SerializedChannel) {
      console.log("click")
      this.declineInvite({ invite: invite, userName: this.activeUserNickname })
    },
    handleSend () {
      if (!this.isSendDisabled) {
        this.send()
      }
    },
    async send () {
      if (this.startsWithSlash()) {
        const parts = this.message.split(' ')
        // console.log(parts)
        switch (parts[0]) {
          case '/create':
            await this.addChannel({
              name: parts[1],
              type: parts[2],
              creator_id: this.activeUserId
            })
            await this.fetchUserChannels()
            break
          case '/join':
            await this.joinChannel({
              name: parts[1],
              type: parts[2],
              user_id: this.activeUserId
            })
            await this.fetchUserChannels()
            break
          case '/cancel':
            await this.leaveChannel({
              name: this.activeChannel,
              user_id: this.activeUserId
            })
            await this.fetchUserChannels()
            break
          case '/quit':
            await this.quitChannel({
              name: this.activeChannel,
              user_id: this.activeUserId
            })
            this.setActive(null)
            await this.fetchUserChannels()
            break
          case '/revoke':
            await this.revokeUser({
              user_name: parts[1],
              channel_name: this.activeChannel,
              active_user_id: this.activeUserId
            })
            break
          case '/kick':
            await this.kickUser({
              user_name: parts[1],
              channel_name: this.activeChannel,
              active_user_id: this.activeUserId
            })
            break
          case '/invite':
            await this.sendInvite({ senderId: this.activeUserId, receiverName: parts[1], channelName: this.activeChannel })
            break
          case '/list':
            // showUserList()
            break
        }
      } else {
        let nickname: string | null =  this.addressedMessage()
        let username = ''

        if (nickname) {
          username = nickname.slice(1)
          console.log('Addressed to:', username)
        }

        if (nickname || username !== this.activeUserNickname) {
          await this.addMessage({ channel: this.activeChannel, message: this.message, addressedTo: username })
        } else {
          this.loading = true
          await this.addMessage({ channel: this.activeChannel, message: this.message, addressedTo: '' })
          this.loading = false
        }
      }
    },
    async fetchUserChannels () {
      try {
        if (this.activeUserId) {
          const response = await this.getChannels(this.activeUserId)
          this.$store.state.channels.userChannels = response.channels
        }
      } catch (error) {
        console.error("Failed to fetch user channels:", error)
      }
    },
    startsWithSlash (): boolean {
      return this.message[0] === '/'
    },
    addressedMessage (): string | null {
      const word = this.message.split(' ').find(word => word.startsWith('@'));
      return word || null
    },
    ...mapMutations('channels', {
      setActiveChannel: 'SET_ACTIVE'
    }),
    ...mapActions('auth', ['logout']),
    ...mapActions('channels', ['addMessage', 'addChannel', 'getChannels', 'join', 'leave', 'joinChannel',
      'leaveChannel', 'quitChannel', 'revokeUser', 'kickUser']),
    ...mapActions('invites', ['sendInvite', 'acceptInvite','declineInvite']),
    setActive (channel: string | null) {
      this.leave(this.lastJoinedName)
      this.setActiveChannel(channel)
      this.join(channel)
      this.lastJoinedName = channel
    }
  },
  async created () {
    await this.fetchUserChannels() // Fetch channels when component is created
    console.log('UserChannels:', this.userChannels[0])
  }
})
</script>
<style>
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
