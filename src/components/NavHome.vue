<script>
import { Screen } from 'quasar';

export default{
  data () {
    return {
      search: ""
    }
  },
  computed: {
    iconSize () {
      if (Screen.width <= Screen.sizes.sm) {
        return '37px';
      } else if (Screen.width <= Screen.sizes.md) {
        return '42px';
      } else if (Screen.width <= Screen.sizes.lg) {
        return '48px';
      } else if (Screen.width <= Screen.sizes.xl) {
        return '48px';
      } else {
        return '55px';
      }
    }

  }

}
</script>

<template>
  <div class="row w-100 q-pt-sm q-pb-sm">
    <div class="col-2 center">
      <q-avatar class="img-own">
        <img src="../assets/logo-white.png" alt="avatar" class="img-fit">
      </q-avatar>
    </div>
    <div class="q-pl-lg q-pr-sm col-7 col-md-8 center">
      <q-input color="white"
               label-color="white"
               bg-color="dark"
               v-model="search"
               label="Search group"
               class="w-100 text-white custom-input"
               outlined>
        <template v-slot:prepend>
          <q-icon name="search" color="white" />
        </template>
      </q-input>
    </div>
    <div class="col-3 col-md-2 center">
      <div class="row justify-end q-mr-lg w-90p">
        <q-icon :name="'settings'" :size="iconSize" class="p-r" />
        <q-icon :name="'logout'" :size="iconSize" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.w-100 {
  width: 100%;
}
.w-90p{
  width: 85%;
}
.img-own {
  width: 160px;
  height: auto;
  object-fit: contain;
}
.text-black{
  color:black;
}
.img-fit {
  width: 100%;
  height: auto;
}
.p-r{
  padding-right: 20px;
}
@media (max-width: 767px) {
  .img-own {
    padding-left: 10px;
    width:100px;
    height: auto;
  }
  .p-r{
    padding-right: 2px;
  }
}

</style>


