<script setup lang="ts">
import { ref } from 'vue'
import { auth, firestore } from '@/lib/firebase'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/lib/store'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from 'vue3-toastify'

const displayName = ref<string>('')
const email = ref<string>('')
const confirmPassword = ref<string>('')
const password = ref<string>('')

const router = useRouter()

const register = async () => {
  if (displayName.value.length <= 5) {
    return toast.error('Display name must be 6 characters or more')
  }

  if (password.value !== confirmPassword.value) {
    return toast.error('Incorrect confirm password')
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await updateProfile(userCredential.user, {
      displayName: displayName.value,
    })

    await addDoc(collection(firestore, 'users'), {
      id: userCredential.user.uid,
      displayName: displayName.value,
      email: email.value,
    })

    await signOut(auth)

    toast.success('Account registered successfully!')
    router.push('/login')
  } catch (error: any) {
    toast.error('An error occurred. Please try again')
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
