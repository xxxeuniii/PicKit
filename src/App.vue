<template>
  <el-container class="app-container">
    <el-header class="site-header">
      <div class="header-inner">
        <div class="brand" @click="router.push('/')">
          <div class="brand-mark"><span></span><span></span><span></span></div>
          <div class="brand-copy">
            <h1>{{ $t("home.title") }}</h1>
            <p>{{ $t("home.subtitle") }}</p>
          </div>
        </div>
        <el-select v-model="locale" @change="changeLanguage" class="language-select">
          <el-option label="中文" value="zh" />
          <el-option label="English" value="en" />
          <el-option label="日本語" value="ja" />
        </el-select>
      </div>
    </el-header>

    <el-main>
      <div class="nav-shell">
        <el-menu :default-active="activeIndex" class="tool-menu" mode="horizontal" router @select="handleSelect">
          <el-menu-item index="/compress">{{ $t("menu.compress") }}</el-menu-item>
          <el-menu-item index="/crop">{{ $t("menu.crop") }}</el-menu-item>
          <el-menu-item index="/convert">{{ $t("menu.convert") }}</el-menu-item>
          <el-menu-item index="/rename">{{ $t("menu.rename") }}</el-menu-item>
          <el-menu-item index="/batch-crop">{{ $t("menu.batchCrop") }}</el-menu-item>
          <el-menu-item index="/pdf">{{ $t("menu.pdf") }}</el-menu-item>
        </el-menu>
      </div>
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

.app-container { min-height: 100vh; display: flex; flex-direction: column; }
.site-header { height: auto; padding: 20px 28px; background: var(--ink); color: white; }
.header-inner { width: min(1180px, 100%); margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.brand { display: flex; align-items: center; gap: 14px; cursor: pointer; }
.brand-mark { width: 48px; height: 48px; border-radius: 15px; background: var(--accent); display: grid; grid-template-columns: repeat(2,1fr); gap: 4px; padding: 9px; transform: rotate(-4deg); }
.brand-mark span { background: var(--ink); border-radius: 3px; }
.brand-mark span:first-child { grid-row: span 2; }
.brand-copy h1 { font-size: 24px; line-height: 1.1; letter-spacing: -.6px; }
.brand-copy p { margin-top: 4px; font-size: 12px; color: #aeb8b3; letter-spacing: .04em; }
.language-select { width: 120px; }
.language-select .el-select__wrapper { background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18); }
.language-select .el-select__selected-item, .language-select .el-select__caret { color: white; }

.el-main { flex: 1; padding: 0 24px 40px; width: min(1228px,100%); margin: auto; overflow: visible; }
.nav-shell { position: sticky; top: 12px; z-index: 20; margin: 18px auto 0; padding: 5px; border: 1px solid rgba(23,32,29,.1); border-radius: 16px; background: rgba(255,254,249,.86); box-shadow: 0 12px 30px rgba(31,39,35,.08); backdrop-filter: blur(18px); }
.tool-menu.el-menu--horizontal { height: 48px; border: 0; background: transparent; gap: 3px; }
.tool-menu.el-menu--horizontal > .el-menu-item { height: 48px; border: 0 !important; border-radius: 11px; color: var(--muted); font-weight: 600; }
.tool-menu.el-menu--horizontal > .el-menu-item:hover, .tool-menu.el-menu--horizontal > .el-menu-item.is-active { color: var(--ink) !important; background: var(--accent); }
.content-container { margin-top: 22px; min-height: 420px; border: 1px solid rgba(23,32,29,.1); border-radius: 24px; background: rgba(255,254,249,.92); box-shadow: 0 24px 70px rgba(31,39,35,.1); overflow: hidden; }

.el-footer { height: auto; background: transparent; color: var(--muted); text-align: center; padding: 20px; font-size: 13px; }
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
  .site-header { padding: 16px; }
  .brand-copy p { display: none; }
  .el-main { padding: 0 10px 24px; }
  .content-container { margin-top: 12px; border-radius: 18px; }
  .el-menu--horizontal { display: flex; flex-wrap: nowrap; overflow-x: auto; }
  .el-menu--horizontal > .el-menu-item { flex: 0 0 auto; padding: 0 14px; min-width: unset; }
}
</style>
