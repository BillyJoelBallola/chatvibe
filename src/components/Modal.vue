<script setup lang="ts">
const props = defineProps<{
  toggleModal: () => void
  title: string
}>()
</script>

<template>
  <div class="modal_container">
    <div class="modal_box">
      <div class="modal_box_header">
        <h3>{{ props.title }}</h3>
        <button @click="props.toggleModal">&#10005;</button>
      </div>
      <slot name="form"></slot>
    </div>
  </div>
</template>

<style scoped>
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
  width: 90%;
}

@media (min-width: 720px) {
  .modal_box {
    width: 60%;
  }
}

@media (min-width: 1020px) {
  .modal_box {
    width: 30%;
  }
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
