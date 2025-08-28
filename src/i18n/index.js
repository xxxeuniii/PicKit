import { createI18n } from 'vue-i18n'
import zh from './zh.js'
import ja from './ja.js'
import en from './en.js'

const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: localStorage.getItem('locale') || 'zh', // 默认语言
  fallbackLocale: 'zh', // 备用语言
  messages: {
    zh,
    ja,
    en
  }
})

export default i18n