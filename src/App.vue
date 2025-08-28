<template>
  <el-container class="app-container">
    <el-header>
      <div class="header-content">
        <div class="header-title">
          <h1>{{ $t('header.title') }}</h1>
          <p>{{ $t('header.subtitle') }}</p>
        </div>
        <div class="language-switcher">
          <el-dropdown @command="handleLanguageChange">
            <span class="el-dropdown-link">
              {{ $t(`language.${currentLocale}`) }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="lang in availableLocales" :key="lang" :command="lang">
                  {{ $t(`language.${lang}`) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    
    <el-main>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        router
        @select="handleSelect"
      >
        <el-menu-item index="/compress">{{ $t('menu.compress') }}</el-menu-item>
        <el-menu-item index="/crop">{{ $t('menu.crop') }}</el-menu-item>
        <el-menu-item index="/convert">{{ $t('menu.convert') }}</el-menu-item>
        <el-menu-item index="/rename">{{ $t('menu.rename') }}</el-menu-item>
      </el-menu>
      
      <div class="content-container">
        <router-view />
      </div>
    </el-main>
    
    <el-footer>
      <p>{{ $t('footer.copyright', { year: new Date().getFullYear() }) }}</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// 当前语言
const currentLocale = computed(() => locale.value)

// 可用语言列表
const availableLocales = ['zh', 'ja', 'en']

// 处理语言切换
const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

// 计算当前活动的菜单项
const activeIndex = computed(() => {
  return route.path
})

// 处理菜单选择
const handleSelect = (key) => {
  router.push(key)
}

// 组件挂载时，如果是根路径，重定向到压缩页面
onMounted(() => {
  if (route.path === '/') {
    router.push('/compress')
  }
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
  color: #303133;
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部样式 */
.el-header {
  background-color: #409eff;
  color: white;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  text-align: center;
}

.header-title h1 {
  font-size: 28px;
  margin-bottom: 5px;
}

.header-title p {
  font-size: 16px;
  opacity: 0.8;
}

.language-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
}

.el-dropdown-link {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 主体内容样式 */
.el-main {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* 内容容器 */
.content-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

/* 页脚样式 */
.el-footer {
  background-color: #303133;
  color: #909399;
  text-align: center;
  padding: 15px;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-menu--horizontal {
    display: flex;
    flex-wrap: wrap;
  }
  
  .el-menu--horizontal > .el-menu-item {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}
</style>