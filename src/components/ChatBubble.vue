<template>
  <q-card
    class="chat"
    flat
    square
  >
    <q-card-section>
      <div class="row">
        <div class="col">
          <img src="../assets/user-img.png" alt="User Image" class="user-image" />
        </div>
        <div class="col content-center">
          <div class="row">
            <strong>{{ user }}</strong>
          </div>
          <div class="row">
            {{ message }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
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
  margin-right: 30px; /* Odstup od textu */
}
.chat {
  width: 100%;
}

</style>



