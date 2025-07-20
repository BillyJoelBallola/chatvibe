<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, firestore } from '../lib/firebase'
import type { MemberType, RoomType } from '@/lib/types'
import { useUserStore } from '@/lib/store'
import RoomInfoButton from './RoomInfoButton.vue'
import UserButton from './UserButton.vue'

const roomId = ref<string | null>(null)
const roomInfo = ref<RoomType | null>(null)
const isPopOverOpen = ref<boolean>(false)
const isSlideOpen = ref<boolean>(false)

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

async function fetchRoomInfo(roomId: string) {
  try {
    const roomRef = doc(firestore, 'chat_rooms', roomId)
    const roomSnapshot = await getDoc(roomRef)

    if (roomSnapshot.exists()) {
      roomInfo.value = { id: roomId, ...roomSnapshot.data() } as RoomType
    } else {
      roomInfo.value = null
    }
  } catch (error) {
    console.error('Error fetching room data:', error)
  }
}

async function leaveRoom() {
  try {
    if (!roomInfo.value || !store.user) return

    const isAdmin = roomInfo?.value.admin.id === store?.user.uid

    const roomRef = doc(firestore, 'chat_rooms', roomInfo?.value.id!)

    if (isAdmin) {
      // Admin leaves: you might want to delete the room or transfer ownership here
      console.warn('Admin leaving is not yet implemented.')
    } else {
      const memberIndex = roomInfo.value.members.findIndex(
        (member: MemberType) => member.id === store.user.uid,
      )
      if (memberIndex === -1) {
        console.warn('Member not found.')
        return
      }
      const updatedMembers = roomInfo.value.members.filter(
        (member: MemberType) => member.id !== store.user.uid,
      )
      await updateDoc(roomRef, {
        members: updatedMembers,
      })

      router.push('/')
    }
  } catch (error) {
    console.error('Error leaving room:', error)
  }
}

watch(
  () => route.params.roomId,
  (newRoomId) => {
    roomId.value = newRoomId as string | null
    if (roomId.value) {
      fetchRoomInfo(roomId.value)
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
    fetchRoomInfo(newRoomId)
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
          <small v-if="store.user.email === roomInfo.admin.email">Owned</small>
        </div>
      </div>
    </div>
    <div class="right_container">
      <RoomInfoButton
        v-if="roomInfo"
        :roomInfo
        :isSlideOpen
        @leaveRoom="leaveRoom"
        @toggleSlide="isSlideOpen = !isSlideOpen"
      />
      <UserButton
        :isPopOverOpen
        :user="!!store.user"
        :displayName="store.user.displayName"
        :email="store.user.email"
        @logout="logout"
        @togglePopOver="isPopOverOpen = !isPopOverOpen"
      />
    </div>
  </header>
</template>

<style scoped>
.right_container {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

header {
  position: fixed;
  top: 0;

  z-index: 999;

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
  color: var(--color-400);
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
</style>
