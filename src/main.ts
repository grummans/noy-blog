import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initDarkMode } from './utils/darkMode'

// Initialize dark mode before creating the app
initDarkMode()

createApp(App).use(router).mount('#app')
