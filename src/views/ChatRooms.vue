<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { firestore } from '../lib/firebase'
import { useUserStore } from '@/lib/store'
import CreateRoomButton from '@/components/CreateRoomButton.vue'
import { collection, query, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import type { MemberType, RoomType } from '@/lib/types'

const rooms = ref<RoomType[]>([])
const filter = ref<'all' | 'my_rooms'>('all')
const isModalOpen = ref<boolean>(false)
const isCreating = ref<boolean>(false)

const store = useUserStore()

const filteredChatRooms = computed(() => {
  switch (filter.value) {
    case 'all':
      return rooms.value.filter(
        (room: RoomType) =>
          room.admin.id === store.user.uid ||
          room.members.find((member) => member.id === store.user.uid),
      )
    case 'my_rooms':
      return rooms.value.filter((room: RoomType) => room.admin.id === store.user?.uid)
    default:
      return rooms.value
  }
})

async function createChatRoom(name: string, members: MemberType[]) {
  try {
    isCreating.value = true

    if (name.trim() === '') return

    await addDoc(collection(firestore, 'chat_rooms'), {
      name: name.trim(),
      admin: {
        id: store.user?.uid,
        email: store.user?.email,
        displayName: store.user?.displayName,
      },
      members: members || [],
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error creating chat room: ', error)
  } finally {
    isCreating.value = false
    isModalOpen.value = false
  }
}

function fetchRooms() {
  const roomsRef = collection(firestore, 'chat_rooms')
  const q = query(roomsRef, limit(50))

  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      rooms.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RoomType)
    } else {
      console.log('No rooms found')
    }
  })
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

onMounted(() => {
  fetchRooms()
})
</script>

<template>
  <div class="chatroom_container">
    <div class="chatroom_header">
      <h2>Chat Rooms</h2>
      <CreateRoomButton :isCreating :createChatRoom :isModalOpen @toggleModal="toggleModal" />
    </div>
    <div class="chatroom_filters">
      <button :class="{ selected: filter === 'all' }" @click="filter = 'all'">All</button>
      <button :class="{ selected: filter === 'my_rooms' }" @click="filter = 'my_rooms'">
        My Rooms
      </button>
    </div>
    <div v-if="filteredChatRooms.length !== 0" class="chatroom_list">
      <TransitionGroup name="room_list" tag="div" class="room_list">
        <RouterLink :to="`/${room.id}`" v-for="room in filteredChatRooms" :key="room.id">
          <h4>{{ room.name }}</h4>
          <span v-if="room.admin.email !== store.user.email"
            >Admin: {{ room.admin.displayName ?? room.admin.email }}</span
          >
          <span v-else>Your room</span>
        </RouterLink>
      </TransitionGroup>
    </div>
    <div v-else class="no_rooms">
      <p>No rooms found. Start creating your own room.</p>
    </div>
  </div>
</template>

<style scoped>
.chatroom_container {
  padding-top: 4rem;
  padding-bottom: 10rem;
  color: var(--color-50);
  display: grid;
  gap: 1rem;
}

.no_rooms {
  font-size: 0.9rem;
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

.chatroom_list a span:last-child {
  font-size: 0.8rem;
  color: var(--color-400);
}

.chatroom_filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chatroom_filters button {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid;
}

.chatroom_filters button {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--color-500);
  color: var(--color-50);
  background: transparent;
  font-weight: 600;
  transition: all 150ms ease;
}

.chatroom_filters button:hover {
  background: var(--color-800);
}

.chatroom_filters button.selected {
  background: var(--color-50);
  border-color: var(--color-50);
  color: var(--color-950);
}

.room_list-enter-active,
.room_list-leave-active {
  transition: all 0.5s ease;
}

.room_list-enter-from,
.room_list-leave-to {
  opacity: 0;
  transform: translateX(300px);
}
</style>
