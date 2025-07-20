<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MemberType, RoomType } from '@/lib/types'
import Modal from './Modal.vue'
import { collection, limit, onSnapshot, query } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { toast } from 'vue3-toastify'
import { useUserStore } from '@/lib/store'

const isChatMembersOpen = ref<boolean>(false)
const isPrivacyAndSupportOpen = ref<boolean>(false)
const isModalOpen = ref<boolean>(false)
const isAdding = ref<boolean>(false)
const members = ref<MemberType[]>([])
const userList = ref<MemberType[]>([])

const store = useUserStore()

async function fetchUsers() {
  console.log('call')
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

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

watch(
  () => isModalOpen.value,
  () => {
    if (isModalOpen.value) {
      members.value = []
      fetchUsers()
    }
  },
)

const props = defineProps<{
  isSlideOpen: boolean
  roomInfo: RoomType | null
}>()

const emits = defineEmits<{
  (event: 'toggleSlide'): void
  (event: 'leaveRoom'): void
}>()
</script>

<template>
  <button @click="emits('toggleSlide')" class="room_info_btn">
    <img src="/info.png" alt="info-icon" />
  </button>

  <aside v-if="props.isSlideOpen" class="slide_container">
    <button @click="emits('toggleSlide')" class="slide_close_btn">&#10005;</button>
    <div>
      <h3>Second Room 1</h3>
      <span class="roomId">Room ID: {{ roomInfo?.id }}</span>
    </div>
    <div class="slide_btn_container">
      <div class="slide_btn">
        <button @click="toggleModal">
          <img src="/user-plus.png" alt="add-user-icon" />
        </button>
        <span>User</span>
      </div>

      <modal v-if="isModalOpen" :toggleModal title="Add Users">
        <template #form>
          <!-- add members function -->
          <form class="modal_form">
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
            <button class="save_btn" type="submit" :disabled="isAdding">Save</button>
          </form>
        </template>
      </modal>
    </div>
    <div class="slide_content">
      <div class="accordion">
        <button
          @click="isChatMembersOpen = !isChatMembersOpen"
          :class="{ active: isChatMembersOpen }"
          class="accordion_btn"
        >
          <span>Chat members</span>
          <img src="/chevron.png" alt="chevron-icon" />
        </button>
        <div v-if="isChatMembersOpen" class="accordion_content">
          <div class="user">
            <div class="user_info">
              <span>{{ roomInfo?.admin.displayName }}</span>
              <span>Room creator</span>
            </div>
            <button class="user_menu_btn">
              <img src="/ellipsis.png" alt="menu-icon" />
            </button>
          </div>

          <div class="user" v-for="user in roomInfo?.members" :key="user.id">
            <div class="user_info">
              <span>{{ user.displayName }}</span>
              <span>{{ user.email }}</span>
            </div>
            <button class="user_menu_btn">
              <img src="/ellipsis.png" alt="menu-icon" />
            </button>
          </div>
        </div>
      </div>

      <div class="accordion">
        <button
          @click="isPrivacyAndSupportOpen = !isPrivacyAndSupportOpen"
          :class="{ active: isPrivacyAndSupportOpen }"
          class="accordion_btn"
        >
          <span>Privacy & support</span>
          <img src="/chevron.png" alt="chevron-icon" />
        </button>
        <div v-if="isPrivacyAndSupportOpen" class="accordion_content">
          <button @click="emits('leaveRoom')" class="leave_btn">
            <img src="/log-out.png" alt="logout-icon" />
            Leave room
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.slide_btn_container {
  display: grid;
  place-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.slide_btn_container .slide_btn {
  display: grid;
  place-items: center;
}

.slide_btn_container .slide_btn button {
  background: var(--color-700);
  padding: 0.5rem;
  border-radius: 100%;
  display: grid;
  place-items: center;
  transition: all 150ms ease;
}

.slide_btn_container .slide_btn button img {
  width: 1.2rem;
  aspect-ratio: 1;
}

.slide_btn_container .slide_btn button:hover {
  background: var(--color-600);
}

.slide_btn_container .slide_btn span {
  font-size: 0.8rem;
}

.roomId {
  font-size: 0.8rem;
  color: var(--color-400);
}

.room_info_btn {
  background: var(--color-800);
  display: grid;
  place-items: center;
  padding: 0.2rem;
  border-radius: 100vw;
  transition: all 150ms ease;
}

.room_info_btn:hover {
  background: var(--color-700);
}

.room_info_btn img {
  width: 1.2rem;
  aspect-ratio: 1;
}

.slide_container {
  position: absolute;
  right: 0;
  top: 0;
  height: 1000px;
  width: 100%;
  background: var(--color-800);
  padding: 1rem;

  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.1);
}

@media (min-width: 720px) {
  .slide_container {
    width: 50%;
  }
}

@media (min-width: 1020px) {
  .slide_container {
    width: 30%;
  }
}

.slide_container .slide_close_btn {
  background: transparent;
  color: var(--color-50);
  font-size: 1.2rem;
  align-self: flex-end;
}

.slide_content {
  display: grid;
  margin-top: 1rem;
}

.accordion .accordion_btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  color: var(--color-50);
  font-size: 1rem;
  font-weight: 600;
  padding-block: 0.5rem;
  border-radius: 0.5rem;
}

.accordion .accordion_btn img {
  width: 1.2rem;
  aspect-ratio: 1;
  transition: all 150ms ease;
}

.accordion .accordion_btn.active img {
  transform: rotate(180deg);
}

.accordion_content .user {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  padding-block: 0.5rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
  width: 100%;
}

.accordion_content .user .user_info {
  display: grid;
  place-items: start;
}

.accordion_content .user .user_info span:nth-child(1) {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-50);
}

.accordion_content .user .user_info span:last-child {
  font-size: 0.8rem;
  color: var(--color-500);
}

.accordion_content .user .user_menu_btn {
  background: transparent;
  display: grid;
  place-items: center;
  padding: 0.2rem;
  border-radius: 100vw;
  transition: all 150ms ease;
}

.accordion_content .user .user_menu_btn:hover {
  background: var(--color-700);
}

.accordion_content .user .user_menu_btn img {
  width: 1.2rem;
  aspect-ratio: 1;
}

.accordion_content .leave_btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-700);
  color: var(--color-50);
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 150ms ease;
}

.accordion_content .leave_btn:hover {
  background: var(--color-600);
}

.accordion_content .leave_btn img {
  width: 1rem;
  aspect-ratio: 1;
}

.modal_form .save_btn {
  margin-top: 1rem;
  padding: 0.5rem;
  font-weight: 600;
  width: 100%;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.modal_form .save_btn:hover {
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
