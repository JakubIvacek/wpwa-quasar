<script setup lang="ts">

import {ref} from "vue";

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value

}
</script>

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
                <q-btn round color="primary" icon="settings" />
              </div>
              <div class="col">
                <q-btn round color="negative" icon="logout"/>
              </div>
            </div>
          </div>
        </q-toolbar>
      </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Channels
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="bg-transparent"
    >
      <div class="row q-gutter-md q-mr-lg q-my-md">
        <div class="col q-ml-xl">
          <q-input
            v-model="input"
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
            round />
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/Channel.vue'

const linksList = [
  {
    title: 'Channel 1',
    icon: 'school',
    link: ''
  },
  {
    title: 'Channel 2',
    icon: 'chat',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  },
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      linksList,
      leftDrawerOpen: false,
      input: ''
    }
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
