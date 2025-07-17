<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { auth, firestore } from '../lib/firebase'
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'

const messages = ref<any>([])
const messageText = ref<string>('')
const isSending = ref<boolean>(false)
const roomId = ref<string>('')
const user = ref<User | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

const route = useRoute()

const sendMessage = async () => {
  if (messageText.value && roomId.value) {
    try {
      isSending.value = true
      const newMessage = {
        text: messageText.value,
        username: user.value?.displayName || user.value?.email?.split('@')[0],
        email: user.value?.email,
        timestamp: serverTimestamp(),
      }

      await addDoc(collection(firestore, 'chat_rooms', roomId.value, 'messages'), newMessage)

      messageText.value = ''
    } catch (error) {
      console.error('Error sending message: ', error)
    } finally {
      isSending.value = false
    }
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      const lastMessage = messagesContainer.value.lastElementChild
      if (lastMessage) {
        lastMessage.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }
    }
  })
}

const fetchMessages = () => {
  if (roomId.value) {
    const messagesRef = collection(firestore, 'chat_rooms', roomId.value, 'messages')
    const q = query(messagesRef, orderBy('timestamp'), limit(50))

    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        messages.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        scrollToBottom()
      }
    })
  }
}

onMounted(() => {
  roomId.value = route.params.roomId as string
  auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser
  })
  fetchMessages()
  scrollToBottom()
})

watch(messages, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat_container">
    <div class="messages" ref="messagesContainer">
      <div
        v-if="messages.length !== 0"
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{
          align_right: message.email !== user?.email,
          align_left: message.email === user?.email,
        }"
      >
        <div class="message_content">
          <small v-if="message.email !== user?.email">{{ message.username }}</small>
          <div
            :class="{
              light_gray: message.email === user?.email,
              dark_gray: message.email !== user?.email,
            }"
          >
            <p>{{ message.text }}</p>
          </div>
        </div>
        <!-- <small>{{ message.timestamp }}</small> -->
      </div>

      <div v-else class="no_messages">
        <p>Start Sending Messages</p>
      </div>
    </div>

    <div class="form_container">
      <form @submit.prevent="sendMessage">
        <textarea
          v-model="messageText"
          type="text"
          placeholder="Type a message..."
          aria-label="Message input"
        />
        <button :disabled="isSending" type="submit">
          <img src="/send-horizontal.svg" alt="send" />
        </button>
      </form>
      <div>
        <small>Design & Built by Billy Joel</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat_container {
  padding-top: 4rem;
  padding-bottom: 10rem;
  color: var(--color-50);

  position: relative;
  display: flex;
  flex-direction: column;

  min-height: 100dvh;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no_messages {
  display: grid;
  place-items: center;
  font-size: clamp(1.2rem, 4vw, 2rem);
  height: 60dvh;
  padding-top: 10rem;
}

.message_content small {
  color: var(--color-500);
}

.message_content div {
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
}

.align_right,
.align_left {
  max-width: 70%;
}

.align_right {
  align-self: flex-start;
}

.align_left {
  align-self: flex-end;
}

.dark_gray {
  background: var(--color-800);
}

.light_gray {
  background: var(--color-700);
}

.form_container {
  position: fixed;
  width: 90%;
  bottom: 0;
  text-align: center;
  background: var(--color-900);
  border-radius: 1.5rem 1.5rem 0 0;
}

@media (min-width: 720px) {
  .form_container {
    width: 70%;
  }
}

@media (min-width: 1020px) {
  .form_container {
    width: 50%;
  }
}

.form_container div {
  color: var(--color-500);
  background: var(--color-900);
}

.form_container form {
  background: var(--color-800);
  padding: 1rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-700);
}

.form_container form textarea {
  color: inherit;
  width: 100%;
  font-family: inherit;
  resize: none;
  background: transparent;
  height: 1.5rem;
  font-size: 0.9rem;
}

.height_increase {
  height: 4rem;
}

.form_container form button {
  display: grid;
  place-items: center;
  border-radius: 100vw;
  height: 2.2rem;
  aspect-ratio: 1;
}

.form_container form button img {
  height: 20px;
  aspect-ratio: 1;
}
</style>
