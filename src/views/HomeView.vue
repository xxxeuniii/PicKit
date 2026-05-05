<template>
  <div class="home-container">
    <div class="feature-list">
      <el-row :gutter="20">
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/compress')">
            <div class="feature-header">
              <el-icon><Picture /></el-icon>
              <h3>{{ $t('home.features.compress.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.compress.description') }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/crop')">
            <div class="feature-header">
              <el-icon><Crop /></el-icon>
              <h3>{{ $t('home.features.crop.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.crop.description') }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/convert')">
            <div class="feature-header">
              <el-icon><RefreshRight /></el-icon>
              <h3>{{ $t('home.features.convert.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.convert.description') }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/rename')">
            <div class="feature-header">
              <el-icon><Edit /></el-icon>
              <h3>{{ $t('home.features.rename.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.rename.description') }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/batch-crop')">
            <div class="feature-header">
              <el-icon><Crop /></el-icon>
              <h3>{{ $t('home.features.batchCrop.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.batchCrop.description') }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
          <el-card shadow="never" class="feature-card" @click="$router.push('/pdf')">
            <div class="feature-header">
              <el-icon><Document /></el-icon>
              <h3>{{ $t('home.features.pdf.title') }}</h3>
            </div>
            <div class="feature-description">
              {{ $t('home.features.pdf.description') }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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
  margin-top: 10px;
}

.feature-card {
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
  padding: 20px;
  margin-bottom: 16px;
}

.feature-card:hover {
  border-color: #c0c4cc;
  background-color: #fafafa;
}

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
}
</style>