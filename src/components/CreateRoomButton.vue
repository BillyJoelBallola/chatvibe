<script setup lang="ts">
import { ref } from 'vue'

const roomName = ref<string>('')

const props = defineProps<{
  isModalOpen: boolean
  createChatRoom: (name: string) => void
}>()

const emits = defineEmits<{
  (event: 'toggleModal'): void
}>()
</script>

<template>
  <button @click="emits('toggleModal')" class="create_btn">Create Room</button>

  <div class="modal_container" v-if="props.isModalOpen">
    <div class="modal_box">
      <div class="modal_box_header">
        <h3>Create Room</h3>
        <button @click="emits('toggleModal')">&#10005;</button>
      </div>
      <form @submit.prevent="createChatRoom(roomName)">
        <div class="input_group">
          <label>Room's Name</label>
          <input v-model="roomName" type="text" />
        </div>
        <button>Create</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create_btn {
  background: var(--color-50);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  transition: all 150ms ease;
}

.create_btn:hover {
  background: var(--color-300);
}

.modal_container {
  position: fixed;
  inset: 0;
  background: rgb(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);

  display: grid;
  place-items: center;
}

.modal_box {
  position: absolute;
  background: var(--color-900);
  padding: 1rem;
  border-radius: 0.5rem;
  width: 30%;
}

.modal_box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal_box form button {
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.modal_box form button:hover {
  background: var(--color-300);
}

.modal_box_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.modal_box_header h3 {
  font-size: 1rem;
}

.modal_box_header button {
  background: transparent;
  color: var(--color-50);
  font-size: 1.2rem;
}
</style>
