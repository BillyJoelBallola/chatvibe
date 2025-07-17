<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { auth, firestore } from '../lib/firebase'
import { collection, query, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

const messages = ref<any>([])
const messageText = ref('')
const roomId = ref<string>('')
const user = ref<any>(null)

const route = useRoute()

const sendMessage = async () => {
  if (messageText.value && roomId.value) {
    try {
      const newMessage = {
        text: messageText.value,
        username: user.value?.displayName || user.value?.email || 'Anonymous',
        timestamp: serverTimestamp(),
      }

      await addDoc(collection(firestore, 'chat_rooms', roomId.value, 'messages'), newMessage)

      messageText.value = ''
    } catch (error) {
      console.error('Error sending message: ', error)
    }
  }
}

const fetchMessages = () => {
  if (roomId.value) {
    const messagesRef = collection(firestore, 'chat_rooms', roomId.value, 'messages')
    const q = query(messagesRef, orderBy('timestamp'), limit(50))

    onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        messages.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
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
})
</script>

<template>
  <div class="chat_container">
    <div class="messages">
      <div
        v-if="messages.length !== 0"
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{
          right: message.username !== user?.email,
          left: message.username === user?.email,
        }"
      >
        <div class="message_content">
          <small v-if="message.username !== user?.email">{{ message.username }}</small>
          <div
            :class="{
              light_gray: message.username === user?.email,
              dark_gray: message.username !== user?.email,
            }"
          >
            <p v-html="message.text"></p>
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
        <button type="submit">
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
  color: var(--color-50);

  position: relative;
  display: flex;
  flex-direction: column;

  height: 100dvh;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 10rem;
  margin-bottom: 4rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no_messages {
  display: grid;
  place-items: center;
  font-size: clamp(1.2rem, 4vw, 2rem);
  height: 100%;
}

.message_content small {
  color: var(--color-500);
}

.message_content div {
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
}

.right,
.left {
  max-width: 70%;
}

.right {
  align-self: flex-start;
}

.left {
  align-self: flex-end;
}

.dark_gray {
  background: var(--color-800);
}

.light_gray {
  background: var(--color-700);
}

.form_container {
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
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
