import { createMemoryHistory, createRouter } from 'vue-router'

import Chat from '../views/Chat.vue'
import ChatRooms from '../views/ChatRooms.vue'

const routes = [
  { path: '/', component: ChatRooms },
  { path: '/:roomId?', component: Chat, props: true },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
