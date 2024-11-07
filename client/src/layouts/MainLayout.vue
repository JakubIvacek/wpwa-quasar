
<template>
  <q-layout view="hHh lpR lFf">
    <q-header
      class="bg-img"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          color="black"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-avatar class="img-own q-ma-sm">
          <img src="../assets/logo-white.png" alt="logo" class="bg-primary" >
        </q-avatar>
        <q-toolbar-title class="text-weight-bold text-h4 title">
          ChatterBox
        </q-toolbar-title>
        <div class="width">
          <div class="row q-pa-sm q-ml-lg q-col-gutter-sm right-buttons">
            <div class="col right">
              <q-btn round color="primary" icon="settings"  @click="settings = true"/>
            </div>
            <div class="col">
              <q-btn round color="negative" icon="logout" @click="onLogout"/>
            </div>
          </div>
        </div>
      </q-toolbar>
      <settings-modal v-model="settings"></settings-modal>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="767"
      class="scroll"
      show-if-above
      bordered
    >
      <q-scroll-area style="height: calc(100% - 100px)">
        <q-list>
          <q-item
            v-for="(channel, index) in channels"
            :key="index"
            clickable
            v-ripple
            @click="setActiveChannel(channel)"
          >
            <q-item-section>
              <q-item-label lines="1"> {{ channel }} </q-item-label>
              <q-item-label class="conversation__summary" caption>
                {{ lastMessageOf(channel)?.content || '' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="keyboard_arrow_down" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { defineComponent } from "vue"
import SettingsModal from "components/SettingsModal.vue"

export default defineComponent({
  name: 'ChatLayout',
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
    })
  },
  methods: {
    async send () {
      this.loading = true
      await this.addMessage({ channel: this.activeChannel, message: this.message })
      this.message = ''
      this.loading = false
    },
    onLogout () {
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push('/auth/')
      })
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
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
@media (max-width: 767px) {
  .img-own {
    padding-left: 10px;
    width:100px;
    height: auto;
  }
}
@media (max-width: 500px) {
  .title {
    display: none;
  }
  .right-buttons {
    width: 100%;
    justify-content: end;
    position: relative;
    left: 50px;
  }
  .width {
    justify-content: end;
    width: 100%;
  }
  .right {
    justify-content: end;
    text-align: end;
  }
}
@media (max-width: 400px) {
  .right-buttons {
    left: 20px;
  }
}
.bg-img {
  background-image: url('../assets/bg-img.jpg');
  background-size: cover;
  background-position: top;
}
.img-own {
  width: 80px;
  height: auto;
  object-fit: contain;
}
</style>
