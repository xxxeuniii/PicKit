import { createI18n } from 'vue-i18n'
import zh from './zh.js'
import en from './en.js'
import ja from './ja.js'

const messages = {
  zh,
  en,
  ja
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages
})

export default i18n