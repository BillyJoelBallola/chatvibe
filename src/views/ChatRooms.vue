<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { auth, firestore } from '../lib/firebase'
import { collection, query, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { RouterLink } from 'vue-router'
import CreateRoomButton from '@/components/CreateRoomButton.vue'

const rooms = ref<any>([])
const user = ref<User | null>()
const isModalOpen = ref<boolean>(false)

async function createChatRoom(name: string) {
  try {
    if (name.trim() === '') return

    await addDoc(collection(firestore, 'chat_rooms'), {
      name: name.trim(),
      owner: {
        id: user.value?.uid,
        email: user.value?.email,
      },
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error creating chat room: ', error)
  } finally {
    isModalOpen.value = false
  }
}

function fetchRooms() {
  const roomsRef = collection(firestore, 'chat_rooms')
  const q = query(roomsRef, limit(50))

  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      rooms.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } else {
      console.log('No rooms found')
    }
  })
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

onMounted(() => {
  auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser
  })
  fetchRooms()
})
</script>

<template>
  <div class="chatroom_container">
    <div class="chatroom_header">
      <h2>Chat Rooms</h2>
      <CreateRoomButton :createChatRoom :isModalOpen @toggleModal="toggleModal" />
    </div>
    <div class="chatroom_list">
      <RouterLink :to="`/${room.id}`" v-for="room in rooms" :key="room.id">
        <span>{{ room.name }}</span>
        <span>Owner: {{ room.owner.email }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.chatroom_container {
  padding-top: 4rem;
  padding-bottom: 10rem;
  color: var(--color-50);
}

.chatroom_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatroom_header h2 {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
}

.chatroom_list {
  display: grid;
  margin-top: 1rem;
}

.chatroom_list a {
  padding: 1rem 0.5rem;
  display: grid;
  color: var(--color-50);
}

.chatroom_list a:not(:last-child) {
  border-bottom: 1px solid var(--color-800);
}

.chatroom_list a:hover {
  background: var(--color-800);
}

.chatroom_list a span:nth-child(1) {
  font-weight: 600;
}

.chatroom_list a span:nth-child(2) {
  font-size: 0.8rem;
  color: var(--color-400);
}
</style>
