
<script setup>

import NavHome from "components/NavHome.vue";
</script>

<template>

  <div class="row bg-img">
     <NavHome></NavHome>
  </div>
  <div class="row justify-center">
    <div class="col-11 col-md-4 col-lg-3 col-xl-1 h-100 bg-black">
      <h1 class="text-white">SKUPINY</h1>
    </div>
    <div class="col-11 col-md-8 col-lg-9 col-xl-11 h-100 bg-green">
        <div class="row h-90p">
            <h1>CHAT</h1>
        </div>
        <div class="row h-10p bg-warning">
          <P class="text-white">Prikazovy riadok</P>
        </div>
    </div>
  </div>
</template>

<style scoped>
/*TIE HEIGHT LEN TAK ABY SOM VEDEL AKO TO VYZERA AJ BG COLOR CI JE DOBRY LAYOUT TO POTOM PREC */
  .h-100{
    min-height: 940px;
  }
  .h-20{
    min-height: 50px;
  }
  .h-10p{
    height:10%
  }
  .h-90p{
    height: 90%;
  }
.bg-img {
  background-image: url('../assets/bg-img.jpg');
  background-size: cover;
  background-position: top;
}
</style>
