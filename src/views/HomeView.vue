<template>
  <div class="home-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h2>{{ $t('home.welcome') }}</h2>
        </div>
      </template>
      <div class="feature-list">
        <el-row :gutter="20">
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/compress')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Picture /></el-icon>
                  <h3>{{ $t('home.features.compress.title') }}</h3>
                </div>
              </template>
              <div class="feature-description">
                {{ $t('home.features.compress.description') }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/crop')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Crop /></el-icon>
                  <h3>{{ $t('home.features.crop.title') }}</h3>
                </div>
              </template>
              <div class="feature-description">
                {{ $t('home.features.crop.description') }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/convert')">
              <template #header>
                <div class="feature-header">
                  <el-icon><RefreshRight /></el-icon>
                  <h3>{{ $t('home.features.convert.title') }}</h3>
                </div>
              </template>
              <div class="feature-description">
                {{ $t('home.features.convert.description') }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/rename')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Edit /></el-icon>
                  <h3>{{ $t('home.features.rename.title') }}</h3>
                </div>
              </template>
              <div class="feature-description">
                {{ $t('home.features.rename.description') }}
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/pdf')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Document /></el-icon>
                  <h3>{{ $t('home.features.pdf.title') }}</h3>
                </div>
              </template>
              <div class="feature-description">
                {{ $t('home.features.pdf.description') }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Picture, Crop, RefreshRight, Edit, Document } from '@element-plus/icons-vue';
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.feature-list {
  margin-top: 20px;
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.el-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  cursor: pointer;
}

.el-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 1024px) {
  .home-container {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  .feature-header h3 {
    font-size: 16px;
  }
  .feature-description {
    font-size: 13px;
  }
}
</style>