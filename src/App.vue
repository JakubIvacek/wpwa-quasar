<template>
  <router-view />
</template>

<script setup>
defineOptions({
  name: 'App',
  created () {
    this.$q.dark.set(true)
  }
});

</script>
