import App from './App.vue'

import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './lib/router'
import piniaPersist from 'pinia-plugin-persistedstate'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
    transition: 'slide',
  } as ToastContainerOptions)
  .use(pinia)
  .use(router)
  .mount('#app')
