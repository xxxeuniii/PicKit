<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">PICK · EDIT · EXPORT</span>
        <h2>{{ $t('home.title') }}</h2>
        <p>{{ $t('home.subtitle') }}</p>
        <el-button type="primary" size="large" @click="$router.push('/compress')">
          {{ $t('menu.compress') }} <span class="arrow">↗</span>
        </el-button>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art-frame frame-back"></div>
        <div class="art-frame frame-main"><div class="sun"></div><div class="hill hill-one"></div><div class="hill hill-two"></div></div>
        <div class="art-label">100% LOCAL</div>
      </div>
    </section>

    <div class="feature-list">
      <el-row :gutter="18">
        <el-col v-for="feature in features" :key="feature.path" :xs="24" :sm="12" :lg="8">
          <el-card shadow="never" class="feature-card" @click="$router.push(feature.path)">
            <span class="feature-number">{{ feature.number }}</span>
            <div class="feature-header">
              <el-icon><component :is="feature.icon" /></el-icon>
              <h3>{{ $t(feature.title) }}</h3>
            </div>
            <div class="feature-description">{{ $t(feature.description) }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { Picture, Crop, RefreshRight, Edit } from '@element-plus/icons-vue';

const features = [
  { number: '01', path: '/compress', icon: Picture, title: 'home.features.compress.title', description: 'home.features.compress.description' },
  { number: '02', path: '/crop', icon: Crop, title: 'home.features.crop.title', description: 'home.features.crop.description' },
  { number: '03', path: '/convert', icon: RefreshRight, title: 'home.features.convert.title', description: 'home.features.convert.description' },
  { number: '04', path: '/rename', icon: Edit, title: 'home.features.rename.title', description: 'home.features.rename.description' },
  { number: '05', path: '/batch-crop', icon: Crop, title: 'home.features.batchCrop.title', description: 'home.features.batchCrop.description' }
];
</script>

<style scoped>
.home-container { padding: 28px; max-width: 1200px; margin: auto; }
.hero { min-height: 310px; display: grid; grid-template-columns: 1.15fr .85fr; gap: 28px; padding: 42px; border-radius: 20px; overflow: hidden; background: #d8ff52; }
.hero-copy { align-self: center; position: relative; z-index: 2; }
.eyebrow { display: inline-block; margin-bottom: 18px; font-size: 11px; font-weight: 800; letter-spacing: .18em; }
.hero h2 { max-width: 560px; font-size: clamp(38px,6vw,72px); line-height: .95; letter-spacing: -.07em; }
.hero p { max-width: 500px; margin: 20px 0 26px; color: #42503b; }
.arrow { margin-left: 12px; font-size: 18px; }
.hero-art { position: relative; min-height: 230px; }
.art-frame { position: absolute; width: min(290px,80%); aspect-ratio: 4/3; border: 3px solid #17201d; border-radius: 18px; }
.frame-back { right: 4%; top: 4%; background: #fffef9; transform: rotate(8deg); }
.frame-main { right: 12%; top: 14%; overflow: hidden; background: #b7dfef; transform: rotate(-5deg); box-shadow: 12px 14px 0 #17201d; }
.sun { position: absolute; width: 55px; height: 55px; border-radius: 50%; right: 28px; top: 25px; background: #ff7047; }
.hill { position: absolute; width: 140%; height: 70%; border-radius: 50%; bottom: -38%; }
.hill-one { left: -45%; background: #285e50; }
.hill-two { right: -70%; bottom: -28%; background: #fffef9; }
.art-label { position: absolute; right: 0; bottom: 8%; padding: 8px 12px; border: 2px solid #17201d; background: #ff7047; font-size: 11px; font-weight: 900; transform: rotate(5deg); }
.feature-list { margin-top: 28px; }
.feature-card { position: relative; cursor: pointer; transition: transform .25s ease, box-shadow .25s ease; border: 1px solid #dcded5; border-radius: 16px; padding: 14px; margin-bottom: 18px; background: #fffef9; }
.feature-card:hover { border-color: #17201d; transform: translateY(-4px); box-shadow: 8px 9px 0 #17201d; }
.feature-header { display: flex; align-items: center; gap: 12px; }
.feature-header .el-icon { width: 40px; height: 40px; border-radius: 12px; background: #edf4d5; font-size: 20px; }
.feature-header h3 { font-size: 18px; }
.feature-number { position: absolute; right: 18px; top: 14px; color: #b7bdb6; font: 700 11px/1 monospace; }
.feature-description { color: #68736e; font-size: 14px; line-height: 1.5; margin-top: 16px; }
@media (max-width: 768px) {
  .home-container { padding: 14px; }
  .hero { grid-template-columns: 1fr; padding: 28px; }
  .hero-art { display: none; }
}
</style>
