<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')

async function loginWithEmailPassword() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (error) {
    console.error('Error during email/password login:', error)
  }
}
</script>

<template>
  <div class="login_container">
    <form class="login_form" @submit.prevent="loginWithEmailPassword()">
      <div class="input_group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Email" />
      </div>
      <div class="input_group">
        <label>Password </label>
        <input v-model="password" type="password" placeholder="Password" />
      </div>
      <button class="login_button">Sign In</button>
    </form>
  </div>
</template>

<style scoped>
.login_container {
  width: 100dvw;
  height: 100dvh;

  display: grid;
  place-items: center;

  color: var(--color-50);
}

.login_form {
  display: grid;
  gap: 1rem;
  width: 90%;
}

@media (min-width: 720px) {
  .login_form {
    width: 50%;
  }
}

@media (min-width: 1020px) {
  .login_form {
    width: 30%;
  }
}

.login_button {
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.login_button:hover {
  background: var(--color-300);
}
</style>
