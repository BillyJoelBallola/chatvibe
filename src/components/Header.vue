<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { watch, ref, onMounted, computed } from 'vue'
import { auth, firestore } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/lib/store'

const roomId = ref<string | null>(null)
const roomInfo = ref<{ name: string; email: string } | null>(null)

const route = useRoute()
const router = useRouter()
const store = useUserStore()

function logout() {
  auth
    .signOut()
    .then(() => {
      store.removeUser()
      router.replace('/login')
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
      roomInfo.value = { name: roomSnapshot.data()?.name, email: roomSnapshot.data()?.admin.email }
    } else {
      roomInfo.value = null
    }
  } catch (error) {
    console.error('Error fetching room data:', error)
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
      roomInfo.value = null
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
        <span>ChatVibe</span>
      </RouterLink>

      <div v-if="roomInfo" class="room_info">
        <div class="horizontal_line" />
        <div class="room_info_text">
          <span>{{ roomInfo.name }}</span>
          <small v-if="store.user.email === roomInfo.email">Owned</small>
        </div>
      </div>
    </div>
    <div class="right_container">
      <span class="user_info" v-if="store.user">{{
        store.user.displayName || store.user.email
      }}</span>
      <button class="signout_btn" @click="logout()">Logout</button>
    </div>
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

.room_info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.room_info .room_info_text {
  display: grid;
}

.room_info .room_info_text span {
  font-weight: 600;
}

.room_info .room_info_text small {
  margin-top: -5px;
  font-size: 0.7rem;
}

.horizontal_line {
  height: 1.5rem;
  width: 1px;
  background: var(--color-50);
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
  color: var(--color-50);
}

.logo span {
  font-weight: 600;
  font-size: 1.2rem;
  display: none;
}

@media (min-width: 720px) {
  .logo span {
    display: block;
  }
}

.logo img {
  width: 1.5rem;
  aspect-ratio: auto;
}

.right_container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.right_container .user_info {
  font-weight: 600;
  font-size: 0.9rem;
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
