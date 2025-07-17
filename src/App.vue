<script setup lang="ts">
import { ref } from 'vue'

import { auth } from './lib/firebase'
import type { User } from 'firebase/auth'
import BaseLayout from './layout/BaseLayout.vue'
import Login from './views/Login.vue'

const loggedUser = ref<User | null>()

auth.onAuthStateChanged((user) => {
  loggedUser.value = user
})
</script>

<template>
  <Login v-if="!loggedUser" />
  <BaseLayout v-else>
    <router-view />
  </BaseLayout>
</template>
