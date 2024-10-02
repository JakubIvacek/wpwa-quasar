<template>
  <img src="../assets/bg-img.jpg" alt="bg-img" class="bg-img">
  <div class="col-12 col-md-6 content-center flex custom-form">
    <router-view />
  </div>
</template>

<script>
export default {
  props: {
    paddingTopValue: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
* {
  font-family: 'Roboto', sans-serif;
}
.bg-img {
  position: fixed;
  height: 100%;
  width: 66%;
  left: 0;
  bottom: 0;
  z-index: 0;
  object-fit: cover;
  object-position: left;
}
.custom-form {
  justify-content: flex-end;
  padding-top: 60px;
  padding-right: 130px;
}
@media (max-width: 767px) {
  .custom-form {
    justify-content: center;
    padding: 60px 0 0;
  }
  .bg-img {
    width: 80%;
  }
}
</style>
