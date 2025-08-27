<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <h2>欢迎使用图片工具箱</h2>
        </div>
      </template>
      <div class="feature-list">
        <el-row :gutter="20">
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/compress')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Picture /></el-icon>
                  <h3>图片压缩</h3>
                </div>
              </template>
              <div class="feature-description">
                压缩图片大小，保持适当的图片质量，减小文件体积，提高加载速度。
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/crop')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Crop /></el-icon>
                  <h3>图片裁剪</h3>
                </div>
              </template>
              <div class="feature-description">
                自由裁剪图片尺寸，调整图片比例，获取需要的图片区域。
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/convert')">
              <template #header>
                <div class="feature-header">
                  <el-icon><RefreshRight /></el-icon>
                  <h3>格式转换</h3>
                </div>
              </template>
              <div class="feature-description">
                将图片转换为不同格式，支持JPG、PNG、WEBP等常见格式互转。
              </div>
            </el-card>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12">
            <el-card shadow="hover" @click="$router.push('/rename')">
              <template #header>
                <div class="feature-header">
                  <el-icon><Edit /></el-icon>
                  <h3>批量重命名</h3>
                </div>
              </template>
              <div class="feature-description">
                批量处理图片文件名，支持添加前缀、后缀、序号等多种命名方式。
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Picture, Crop, RefreshRight, Edit } from '@element-plus/icons-vue';
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

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
}
</style>