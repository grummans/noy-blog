import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initDarkMode } from './utils/darkMode'
import { setupMarkdownPreview } from './plugins/markdown'

// Initialize dark mode before creating the app
initDarkMode()
setupMarkdownPreview()

createApp(App).use(router).mount('#app')
