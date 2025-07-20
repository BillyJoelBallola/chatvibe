<script setup lang="ts">
const props = defineProps<{
  isPopOverOpen: boolean
  user: boolean
  displayName: string
  email: string
}>()

const emits = defineEmits<{
  (event: 'togglePopOver'): void
  (event: 'logout'): void
}>()
</script>

<template>
  <button @click="emits('togglePopOver')" v-if="props.user" class="user_info_btn">
    <img src="/user.png" alt="info-icon" />
  </button>

  <div v-if="isPopOverOpen" class="popover_container">
    <div class="user_info_text">
      <span>{{ props.displayName }}</span>
      <small>{{ props.email }}</small>
    </div>
    <button>
      <img src="/bolt.png" alt="logout-icon" />
      Settings
    </button>
    <div class="horizontal_line" />
    <button @click="emits('logout')">
      <img src="/log-out.png" alt="logout-icon" />
      Logout
    </button>
  </div>
</template>

<style scoped>
.horizontal_line {
  width: 100%;
  height: 1px;
  margin-block: 0.2rem;
  background: var(--color-700);
}

.popover_container {
  position: absolute;
  top: 2.5rem;
  width: 250px;
  right: 1rem;
  background: var(--color-800);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: grid;
}

.popover_container button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-50);
  transition: all 150ms ease;
  font-weight: 600;
}

.popover_container button:hover {
  background: var(--color-700);
}

.popover_container img {
  width: 1rem;
  aspect-ratio: 1;
}

.right_container .user_info_btn {
  background: var(--color-800);
  display: grid;
  place-items: center;
  padding: 0.2rem;
  border-radius: 100vw;
  transition: all 150ms ease;
}

.right_container .user_info_btn:hover {
  background: var(--color-700);
}

.right_container .user_info_btn img {
  width: 1.2rem;
  aspect-ratio: 1;
}

.popover_container .user_info_text {
  display: grid;
  padding-inline: 0.5rem;
  padding-bottom: 0.5rem;
}

.popover_container .user_info_text span {
  font-weight: 600;
}

.popover_container .user_info_text small {
  margin-top: -5px;
  color: var(--color-400);
}
</style>
