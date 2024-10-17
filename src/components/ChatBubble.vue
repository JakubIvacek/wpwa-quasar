<template>
  <div class="chat">
      <div class="row items-center">
        <div class="col-auto">
          <img src="../assets/user-img.png" alt="User Image" class="user-image" />
        </div>
        <div class="col q-py-sm">
          <div class="row">
            <strong>{{ user }}</strong>
          </div>
          <div class="row">
            {{ message }}
          </div>
          <div class="row-auto timestamp float-right">
             {{ timestamp }}
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  id: String,
  user: String,
  message: String,
  timestamp: String
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

.chat {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  padding-right: 8px;
  padding-left: 3px;
}
.timestamp{
  color: darkgray;
  font-size: 12px;
  ;
}
</style>
