// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import i18n from './locales'

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(i18n)

// 🔹 全局挂载 $t，Options API 或模板里直接用
app.config.globalProperties.$t = (...args) => i18n.global.t(...args)

// 🔹 可选：Element Plus 也支持全局 i18n
// 例如让 Element Plus 内置组件使用 vue-i18n
app.use(ElementPlus, {
  i18n: (key, value) => i18n.global.t(key, value),
})

app.mount('#app')
