<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<template>
  <Header />
  <main>
    <slot />
  </main>
</template>

<style scoped>
main {
  width: 90%;
  margin-inline: auto;
}

@media (min-width: 720px) {
  main {
    width: 70%;
  }
}

@media (min-width: 1020px) {
  main {
    width: 50%;
  }
}
</style>
