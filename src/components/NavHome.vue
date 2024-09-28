<script setup>
// Your script logic here
</script>

<template>
  <div class="row w-100 q-pt-sm q-pb-sm">
    <div class="col-2 center">
      <q-avatar class="img-own">
        <img src="../assets/1.png" alt="avatar" class="bg-white img-fit">
      </q-avatar>
    </div>
    <div class="q-pl-lg q-pr-sm col-7 col-md-8 center">
      <q-input outlined  color="white" bg-color="dark" v-model="search" label="Search group" class="w-100">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
    <div class="col-3 col-md-2 center">
      <div class="row justify-end q-mr-lg w-90p">
        <q-icon name="settings" size="42px" class="p-r"/>
        <q-icon name="logout" size="42px" />
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
  width: 100px;
  height: auto;
  object-fit: contain;
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
    width:77px;
    height: auto;
  }
  .p-r{
    padding-right: 2px;
  }
}
</style>


