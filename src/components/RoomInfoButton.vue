<script setup lang="ts">
import type { RoomType } from '@/lib/types'
import { ref } from 'vue'

const isChatMembersOpen = ref<boolean>(false)
const isPrivacyAndSupportOpen = ref<boolean>(false)

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
</style>
