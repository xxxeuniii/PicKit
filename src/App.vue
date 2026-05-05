<template>
  <el-container class="app-container">
    <el-header>
      <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <div style="display: flex; align-items: baseline">
          <h1>{{ $t("home.title") }}</h1>
          <div style="width:10px">
          </div>
          <p>{{ $t("home.subtitle") }}</p>
        </div>

        <el-select v-model="locale" @change="changeLanguage" style="width: 120px">
          <el-option label="中文" value="zh"></el-option>
          <el-option label="English" value="en"></el-option>
          <el-option label="日本語" value="ja"></el-option>
        </el-select>
      </div>
    </el-header>

    <el-main>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router @select="handleSelect">
        <el-menu-item index="/compress">{{ $t("menu.compress") }}</el-menu-item>
        <el-menu-item index="/crop">{{ $t("menu.crop") }}</el-menu-item>
        <el-menu-item index="/convert">{{ $t("menu.convert") }}</el-menu-item>
        <el-menu-item index="/rename">{{ $t("menu.rename") }}</el-menu-item>
        <el-menu-item index="/batch-crop">{{ $t("menu.batchCrop") }}</el-menu-item>
        <el-menu-item index="/pdf">{{ $t("menu.pdf") }}</el-menu-item>
      </el-menu>

      <div class="content-container">
        <router-view />
      </div>
    </el-main>

    <el-footer>
      <p>{{ $t("footer.copyright", { year: new Date().getFullYear() }) }}</p>
      <p class="security-tip">{{ $t("footer.security") }}</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const changeLanguage = (lang) => {
  locale.value = lang;
};

// 计算当前活动的菜单项
const activeIndex = computed(() => {
  return route.path;
});

// 处理菜单选择
const handleSelect = (key) => {
  router.push(key);
};

// 组件挂载时，如果是根路径，重定向到压缩页面
onMounted(() => {
  if (route.path === "/") {
    // router.push('/compress')
  }
});
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
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
  /* color: red; */
  text-align: center;
  /* padding: 20px; */
  /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
}

.el-header h1 {
  font-size: 28px;
  /* margin-bottom: 5px; */
}

.el-header p {
  font-size: 16px;
  opacity: 0.8;
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
  padding: 20px;
  margin-top: 20px;
}

/* 页脚样式 */
.el-footer {
  background-color: #ffffff;
  color: #909399;
  text-align: center;
  padding: 15px;
  font-size: 14px;
  border-top: 1px solid #ebeef5;
}

.el-footer .security-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-header h1 {
    font-size: 22px;
  }
  .el-header p {
    font-size: 14px;
  }
  .el-main {
    padding: 12px;
    max-width: 100%;
  }
  .content-container {
    padding: 12px;
    margin-top: 12px;
  }
  .el-menu--horizontal {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .el-menu--horizontal>.el-menu-item {
    flex: 0 0 auto;
    padding: 0 12px;
    min-width: unset;
  }
}
</style>

<style>
/* 美化下拉框通用样式（应用于带有 pretty-select 类的 Element Plus 选择器） */
.pretty-select :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transition: all 0.2s ease;
}

.pretty-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 6px 18px rgba(64, 158, 255, 0.25);
}

.pretty-select :deep(.is-focus .el-input__wrapper),
.pretty-select :deep(.el-input__wrapper.is-focus) {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
  background: #ffffff;
}

.pretty-select :deep(.el-input__prefix),
.pretty-select :deep(.el-select__caret) {
  color: #409eff;
}

/* 下拉弹层样式（通过 popper-class 控制） */
.pretty-select-popper {
  border-radius: 12px !important;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.pretty-select-popper .el-select-dropdown__item {
  padding: 10px 12px;
}

.pretty-select-popper .el-select-dropdown__item.hover,
.pretty-select-popper .el-select-dropdown__item:hover {
  background: #ecf5ff;
  color: #409eff;
}
</style>
