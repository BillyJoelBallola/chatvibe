<script setup lang="ts">
import { ref } from 'vue'
import { auth } from '@/lib/firebase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/lib/store'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const displayName = ref<string>('')
const email = ref<string>('')
const confirmPassword = ref<string>('')
const password = ref<string>('')

const store = useUserStore()
const router = useRouter()

const register = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      return alert('Incorrect confirm password')
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await updateProfile(userCredential.user, {
      displayName: displayName.value,
    })

    store.setUser(userCredential)
    router.push('/login')
  } catch (error: any) {
    console.error('Error registering user:', error.message)
  }
}
</script>

<template>
  <div class="register_container">
    <div class="register_form">
      <div class="register_text">
        <img src="/chatvibe_logo.png" alt="logo" />
        <div>
          <h1>Register</h1>
          <p style="font-size: 0.9rem">Create an account by filling out all fields.</p>
        </div>
      </div>

      <form @submit.prevent="register()">
        <div class="input_group">
          <label>Display Name</label>
          <input v-model="displayName" type="text" placeholder="Display Name" required autofocus />
        </div>
        <div class="input_group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="input_group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Password" required />
        </div>
        <div class="input_group">
          <label>Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button class="register_button">Register</button>
      </form>
      <small class="link">
        Already have an account? Click to <router-link to="/login">Login</router-link>
      </small>
    </div>
  </div>
</template>

<style scoped>
.register_container {
  width: 100dvw;
  height: 100dvh;

  display: grid;
  place-items: center;

  color: var(--color-50);
}

.register_text {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.register_text img {
  width: clamp(3rem, 4vw, 4rem);
  aspect-ratio: 1;
}

.register_form form {
  display: grid;
  gap: 1rem;
}

.register_form {
  display: grid;
  gap: 2rem;
  width: 90%;
}

@media (min-width: 720px) {
  .register_form {
    width: 50%;
  }
}

@media (min-width: 1020px) {
  .register_form {
    width: 30%;
  }
}

.register_button {
  width: 100%;
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: var(--color-50);
  transition: all 150ms ease;
}

.register_button:hover {
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
