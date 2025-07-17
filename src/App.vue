<script setup lang="ts">
import BaseLayout from './layout/BaseLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <template v-if="route.meta.layout !== 'none'">
    <BaseLayout>
      <router-view />
    </BaseLayout>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>
