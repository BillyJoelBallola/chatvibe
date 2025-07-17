import { createMemoryHistory, createRouter } from 'vue-router'

import Chat from '../views/Chat.vue'
import ChatRooms from '../views/ChatRooms.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import { auth } from './firebase'
import { useUserStore } from './store'

const routes = [
  { path: '/', name: 'ChatRooms', component: ChatRooms, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login, meta: { layout: 'none' } },
  { path: '/register', name: 'Register', component: Register, meta: { layout: 'none' } },
  { path: '/:roomId?', name: 'Chat', component: Chat, props: true, meta: { requiresAuth: true } },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useUserStore()
  const loggedUser = store.user || auth.currentUser

  if (to.meta.requiresAuth && !loggedUser) {
    next('/login')
  } else if (loggedUser && (to.path === '/login' || to.path === '/register')) {
    next('/')
  } else {
    next()
  }
})
