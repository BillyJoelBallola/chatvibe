<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/lib/store'
import { useRouter } from 'vue-router'

const email = ref<string>('')
const password = ref<string>('')
const isLogginIn = ref<boolean>(false)

const router = useRouter()
const store = useUserStore()

async function loginWithEmailPassword() {
  try {
    isLogginIn.value = true

    const loggedUser = await signInWithEmailAndPassword(auth, email.value, password.value)
    store.setUser(loggedUser.user)
    router.push('/')
  } catch (error) {
    console.error('Error during login:', error)
  } finally {
    isLogginIn.value = false
  }
}
</script>

<template>
  <div class="login_container">
    <div class="login_form">
      <div class="login_text">
        <img src="/chatvibe_logo.png" alt="logo" />
        <div>
          <h1>Welcome!</h1>
          <p style="font-size: 0.9rem">Login using your email and password</p>
        </div>
      </div>

      <form @submit.prevent="loginWithEmailPassword()">
        <div class="input_group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Email" required autofocus />
        </div>
        <div class="input_group">
          <label>Password </label>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <button :disabled="isLogginIn" class="login_button">Login</button>
      </form>
      <small class="link">
        Don't have account yet? Click to <router-link to="/register">Register</router-link>
      </small>
    </div>
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

.login_text {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login_text img {
  width: clamp(3rem, 4vw, 4rem);
  aspect-ratio: 1;
}

.login_form form {
  display: grid;
  gap: 1rem;
}

.login_form {
  display: grid;
  gap: 2rem;
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
  width: 100%;
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.login_button:hover {
  background: var(--color-300);
}

.link {
  text-align: center;
  color: var(--color-600);
}

.link a {
  font-weight: 600;
  color: var(--color-50);
}
</style>
