<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { auth, firestore } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const roomId = ref<string | null>(null)
const roomName = ref<string | null>(null)

const route = useRoute()

function signOut() {
  auth
    .signOut()
    .then(() => {
      console.log('User signed out successfully!')
    })
    .catch((error) => {
      console.error('Error signing out: ', error)
    })
}

async function fetchRoomName(roomId: string) {
  try {
    const roomRef = doc(firestore, 'chat_rooms', roomId)
    const roomSnapshot = await getDoc(roomRef)

    if (roomSnapshot.exists()) {
      roomName.value = roomSnapshot.data()?.name || 'Room Name Not Found'
    } else {
      roomName.value = 'Room Not Found'
    }
  } catch (error) {
    console.error('Error fetching room data:', error)
    roomName.value = 'Error Fetching Room'
  }
}

watch(
  () => route.params.roomId,
  (newRoomId) => {
    roomId.value = newRoomId as string | null
    if (roomId.value) {
      fetchRoomName(roomId.value)
    } else {
      roomId.value = null
      roomName.value = null
    }
  },
  { immediate: true },
)

onMounted(() => {
  const newRoomId = route.params.roomId as string | null
  if (newRoomId && newRoomId !== roomId.value) {
    roomId.value = newRoomId
    fetchRoomName(newRoomId)
  }
})
</script>

<template>
  <header>
    <div class="logo_container">
      <RouterLink class="logo" to="/">
        <img src="/chatvibe_logo.png" alt="logo_image" />
        ChatVibe
      </RouterLink>
      <span v-if="roomName">| {{ roomName }}</span>
    </div>
    <button class="signout_btn" @click="signOut()">Sign Out</button>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100dvw;
  padding: 0.5rem 1rem;

  color: var(--color-50);
}

.logo_container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo_container span {
  font-size: 0.9rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-weight: 600;
  font-size: 1.2rem;
  color: var(--color-50);
}

.logo img {
  width: 1.5rem;
  aspect-ratio: auto;
}

.signout_btn {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--color-500);
  color: var(--color-50);
  background: transparent;
  font-weight: 600;
  transition: all 150ms ease;
}

.signout_btn:hover {
  background: var(--color-800);
}
</style>
