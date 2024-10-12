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
      class="scroll"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Channels
        </q-item-label>

        <ChannelLink
          v-for="channel in channelList"
          :key="channel.title"
          :channelId="channel.channelId"
          :title="channel.title"
          :icon="channel.icon"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChannelLink from 'components/ChannelLink.vue'
import { channelList } from 'src/channels'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

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
