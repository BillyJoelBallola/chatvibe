<script setup lang="ts">
import { ref, watch } from 'vue'
import { firestore } from '@/lib/firebase'
import { useUserStore } from '@/lib/store'
import type { MemberType } from '@/lib/types'
import { collection, limit, onSnapshot, query } from 'firebase/firestore'
import { toast } from 'vue3-toastify'
import Modal from './Modal.vue'

const store = useUserStore()

const userList = ref<MemberType[]>([])
const members = ref<MemberType[]>([])
const roomName = ref<string>('')

const props = defineProps<{
  isModalOpen: boolean
  isCreating: boolean
  createChatRoom: (name: string, member: MemberType[]) => void
  toggleModal: () => void
}>()

async function fetchUsers() {
  const roomsRef = collection(firestore, 'users')
  const q = query(roomsRef, limit(10))

  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      userList.value = snapshot.docs
        .filter((doc) => store.user.uid !== doc.data().id)
        .map((doc) => doc.data()) as MemberType[]
    } else {
      console.log('No users found')
    }
  })
}

function selectMember(selectedUser: MemberType) {
  if (members.value.length === 10) {
    return toast('Only 10 members are allowed')
  }

  const memberIndex = members.value?.findIndex((member) => member.id === selectedUser.id)

  if (memberIndex !== -1) {
    return members.value?.splice(memberIndex as number, 1)
  } else {
    return members.value?.push(selectedUser)
  }
}

watch(
  () => props.isModalOpen,
  () => {
    if (props.isModalOpen) {
      roomName.value = ''
      members.value = []
      fetchUsers()
    }
  },
)
</script>

<template>
  <button @click="props.toggleModal" class="create_btn">Create Room</button>

  <modal v-if="props.isModalOpen" :toggleModal title="Create Room">
    <template #form>
      <form class="modal_form" @submit.prevent="createChatRoom(roomName, members)">
        <div class="input_group">
          <label>Room's Name</label>
          <input v-model="roomName" type="text" />
        </div>
        <div class="users_container">
          <div class="users_label">
            <span>Users</span>
            <span>Select users to add to this room.</span>
            <div
              :style="{ 'margin-top': members.length <= 0 ? '0' : '0.5rem' }"
              class="member_list"
            >
              <div class="member" v-for="member in members" :key="member.id">
                <span>{{ member.email }}</span>
              </div>
            </div>
          </div>
          <div class="users">
            <button
              type="button"
              class="user"
              v-for="user in userList"
              :key="user.id"
              @click="selectMember(user)"
            >
              <div class="user_info">
                <span>{{ user.displayName }}</span>
                <span>{{ user.email }}</span>
              </div>
              <img
                v-if="members.find((member) => member.id === user.id)"
                class="selected_user"
                src="/check.png"
                alt="check"
              />
            </button>
          </div>
        </div>
        <button class="submit_btn" type="submit" :disabled="isCreating">Create</button>
      </form>
    </template>
  </modal>
</template>

<style scoped>
.create_btn {
  background: var(--color-50);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  transition: all 150ms ease;
  font-weight: 600;
}

.create_btn:hover {
  background: var(--color-300);
}

.modal_form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal_form .submit_btn {
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.modal_form .submit_btn:hover {
  background: var(--color-300);
}

.users_container .users_label {
  display: grid;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--color-500);
  padding-bottom: 0.5rem;
}

.users_container .users_label .member_list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
}

.users_container .users_label .member_list .member {
  background: var(--color-700);
  padding-inline: 4px;
  border-radius: 0.2rem;
  font-size: 0.8rem;
}

.users_container .users_label span:nth-child(1) {
  font-weight: 600;
}

.users_container .users_label span:nth-child(2) {
  font-size: 0.8rem;
}

.users_container .users {
  max-height: 200px;
  overflow-y: auto;
}

.users_container .user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
}

.users_container .user:hover {
  background: var(--color-800);
}

.users_container .user .user_info {
  display: grid;
  place-items: start;
}

.users_container .user .user_info span:nth-child(1) {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-50);
}

.users_container .user .user_info span:last-child {
  font-size: 0.8rem;
  color: var(--color-500);
}

.users_container .user .selected_user {
  width: 1.2rem;
  aspect-ratio: 1;
}
</style>
