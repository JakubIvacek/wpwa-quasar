<template>
  <div class="chat">
      <div class="row items-center">
        <div class="col-auto flex flex-center">
          <img src="../assets/user-img.png" alt="User Image" class="user-image" />
        </div>
        <div class="col">
          <div class="row">
            <strong>{{ user }}</strong>
          </div>
          <div class="row">
            {{ message }}
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    id: Number,
    user: String,
    message: String,
  })
</script>

<style scoped>
.user-image {
  width: 50px; /* Nastav veľkosť obrázka */
  height: 50px; /* Nastav veľkosť obrázka */
  border-radius: 50%; /* Pre zaoblený tvar */
  margin-right: 10px; /* Odstup od textu */
  background-color: white;
}
.chat {
  width: 100%;
}

</style>



