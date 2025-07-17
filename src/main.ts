import App from './App.vue'

import './style.css'

import { createApp } from 'vue'
import { router } from './lib/router'

createApp(App).use(router).mount('#app')
