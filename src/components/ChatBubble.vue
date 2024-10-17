<template>
  <div class="chat">
      <div class="row items-center">
        <div class="col-auto flex flex-center">
          <img src="../assets/user-img.png" alt="User Image" class="user-image" />
        </div>
        <div class="col">
          <div class="row padding">
            <strong>{{ user }}</strong>
          </div>
          <div class="row">
            {{ message }}
          </div>
          <div class="row">
            <p class="timestamp">14.11.2024 14:45:34</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  user: String,
  message: String
})
</script>

<style scoped>
.padding{
  padding-bottom: 2Px;
}
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

.chat .row {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-right: 8px;
  padding-left: 3px;
}
.timestamp{
  color: darkgray;
  padding-top: 5px;
  font-size: 12px;
}
</style>
