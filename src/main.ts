import App from './App.vue'

import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './lib/router'
import piniaPersist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App).use(pinia).use(router).mount('#app')
