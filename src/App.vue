<template>
  <el-container class="app-container">
    <aside class="site-sidebar">
      <div class="sidebar-inner">
        <div class="brand" @click="router.push('/')">
          <div class="brand-mark"><span></span><span></span><span></span></div>
          <div class="brand-copy">
            <h1>{{ $t("home.title") }}</h1>
            <p>{{ $t("home.subtitle") }}</p>
          </div>
        </div>
        <div class="nav-shell">
          <el-menu :default-active="activeIndex" class="tool-menu" router @select="handleSelect">
            <el-menu-item index="/compress">{{ $t("menu.compress") }}</el-menu-item>
            <el-menu-item index="/crop">{{ $t("menu.crop") }}</el-menu-item>
            <el-menu-item index="/convert">{{ $t("menu.convert") }}</el-menu-item>
            <el-menu-item index="/rename">{{ $t("menu.rename") }}</el-menu-item>
            <el-menu-item index="/batch-crop">{{ $t("menu.batchCrop") }}</el-menu-item>
          </el-menu>
        </div>
        <el-select v-model="locale" @change="changeLanguage" class="language-select">
          <el-option label="中文" value="zh" />
          <el-option label="English" value="en" />
          <el-option label="日本語" value="ja" />
        </el-select>
      </div>
    </aside>

    <el-main>
      <div class="content-container"><router-view /></div>
    </el-main>

    <el-footer>
      <p>{{ $t("footer.copyright", { year: new Date().getFullYear() }) }}</p>
      <p class="security-tip">{{ $t("footer.security") }}</p>
    </el-footer>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const changeLanguage = (lang) => { locale.value = lang; };
const activeIndex = computed(() => route.path);
const handleSelect = (key) => router.push(key);
</script>

<style>
:root {
  --ink: #17201d;
  --muted: #68736e;
  --canvas: #f4f2ea;
  --paper: #fffef9;
  --line: #dcded5;
  --accent: #d8ff52;
  --el-color-primary: #17201d;
  --el-color-success: #5b8f57;
  --el-border-radius-base: 10px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: "Aptos", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: radial-gradient(circle at 10% 0%, rgba(216,255,82,.22), transparent 26rem), var(--canvas);
  color: var(--ink);
  line-height: 1.6;
}

.app-container { min-height: 100vh; display: block; padding-left: 220px; }
.site-sidebar { position: fixed; inset: 0 auto 0 0; width: 220px; z-index: 30; padding: 22px 14px; background: var(--ink); color: white; }
.sidebar-inner { height: 100%; display: flex; flex-direction: column; gap: 28px; }
.brand { display: flex; align-items: center; gap: 14px; cursor: pointer; }
.brand-mark { width: 38px; height: 38px; border-radius: 12px; background: var(--accent); display: grid; grid-template-columns: repeat(2,1fr); gap: 3px; padding: 7px; transform: rotate(-4deg); }
.brand-mark span { background: var(--ink); border-radius: 3px; }
.brand-mark span:first-child { grid-row: span 2; }
.brand-copy h1 { font-size: 20px; line-height: 1.1; letter-spacing: -.5px; }
.brand-copy p { margin-top: 2px; font-size: 10px; color: #aeb8b3; letter-spacing: .04em; }
.language-select { width: 100%; margin-top: auto; }
.language-select .el-select__wrapper { background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
.language-select .el-select__selected-item, .language-select .el-select__caret { color: white; }

.el-main { padding: 18px 24px 36px; width: min(1450px,100%); margin: auto; overflow: visible; }
.nav-shell { width: 100%; }
.tool-menu { border: 0; background: transparent; }
.tool-menu .el-menu-item { height: 46px; margin-bottom: 5px; border-radius: 11px; color: #aeb8b3; font-weight: 600; }
.tool-menu .el-menu-item:hover, .tool-menu .el-menu-item.is-active { color: var(--ink) !important; background: var(--accent); }
.content-container { min-height: calc(100vh - 80px); border: 1px solid rgba(23,32,29,.1); border-radius: 24px; background: rgba(255,254,249,.92); box-shadow: 0 24px 70px rgba(31,39,35,.1); overflow: hidden; }

.el-footer { height: auto; margin-left: 0; background: transparent; color: var(--muted); text-align: center; padding: 12px 20px 20px; font-size: 13px; }
.el-footer .security-tip { font-size: 12px; color: #8b948f; margin-top: 5px; }
.el-button { min-height: 38px; border-radius: 10px; font-weight: 600; }
.el-button--primary { --el-button-bg-color: var(--ink); --el-button-border-color: var(--ink); --el-button-hover-bg-color: #33403b; --el-button-hover-border-color: #33403b; }
.el-upload-dragger { min-height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 1.5px dashed #aeb5ae !important; border-radius: 18px !important; background: #f7f7f0 !important; transition: .25s ease; }
.el-upload-dragger:hover { border-color: var(--ink) !important; background: #f0f5dc !important; transform: translateY(-2px); }
.el-upload-dragger .el-icon--upload { margin: 0 auto 16px; color: var(--ink); }
.el-upload__text em { color: #618b22; font-weight: 700; }
.panel, .rename-options, .file-list, .compression-controls, .image-preview, .crop-controls, .convert-controls, .result-preview { border: 1px solid var(--line); border-radius: 18px; background: var(--paper); box-shadow: 0 8px 24px rgba(31,39,35,.05); }
.el-input__wrapper, .el-select__wrapper, .el-textarea__inner, .el-input-number { border-radius: 10px !important; }

@media (max-width: 768px) {
  .app-container { padding-left: 0; padding-top: 66px; }
  .site-sidebar { inset: 0 0 auto 0; width: 100%; height: 66px; padding: 10px 12px; overflow: hidden; }
  .sidebar-inner { flex-direction: row; align-items: center; gap: 12px; }
  .brand { flex: 0 0 auto; }
  .brand-copy { display: none; }
  .nav-shell { order: 3; min-width: 0; overflow-x: auto; scrollbar-width: none; }
  .nav-shell::-webkit-scrollbar { display: none; }
  .tool-menu { width: max-content; height: 40px; display: flex; flex-wrap: nowrap; }
  .tool-menu .el-menu-item { flex: 0 0 auto; height: 40px; margin: 0 3px 0 0; padding: 0 12px; }
  .language-select { width: 88px; margin: 0; flex: 0 0 auto; }
  .el-main { padding: 10px 10px 24px; }
  .content-container { margin-top: 12px; border-radius: 18px; }
}
</style>
