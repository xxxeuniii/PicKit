<template>
  <div class="compress-view">
    <h2>{{ $t('compress.title') }}</h2>
    
    <div class="tool-container">
      <div class="upload-area">
        <el-upload
          class="upload-component"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false">
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">{{ $t('compress.uploadTip') }} <em>{{ $t('compress.uploadClick') }}</em></div>
        </el-upload>
      </div>
      
      <div v-if="imageData.original" class="image-preview-container">
        <div class="image-preview">
          <h3>{{ $t('compress.original') }}</h3>
          <img :src="imageData.original.url" :alt="$t('compress.original')" class="preview-img">
          <div class="image-info">
            <p>{{ $t('compress.size') }}: {{ imageData.original.width }} x {{ imageData.original.height }} px</p>
            <p>{{ $t('compress.fileSize') }}: {{ formatFileSize(imageData.original.size) }}</p>
          </div>
        </div>
        
        <div class="compression-controls">
          <h3>{{ $t('compress.settings') }}</h3>
          <el-form label-position="top">
            <el-form-item :label="$t('compress.quality')">
              <el-slider v-model="compressQuality" :min="10" :max="100" :step="5" show-stops></el-slider>
              <div class="slider-labels">
                <span>{{ $t('compress.lowQuality') }}</span>
                <span>{{ $t('compress.highQuality') }}</span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('compress.maxWidth')">
              <el-input-number v-model="compressMaxWidth" :min="100" :step="100"></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="compressImage">{{ $t('compress.button') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div v-if="imageData.compressed" class="image-preview">
          <h3>{{ $t('compress.compressed') }}</h3>
          <img :src="imageData.compressed.url" :alt="$t('compress.compressed')" class="preview-img">
          <div class="image-info">
            <p>{{ $t('compress.size') }}: {{ imageData.compressed.width }} x {{ imageData.compressed.height }} px</p>
            <p>{{ $t('compress.fileSize') }}: {{ formatFileSize(imageData.compressed.size) }}</p>
            <p>{{ $t('compress.rate') }}: {{ calculateCompressionRate() }}%</p>
          </div>
          <el-button type="success" @click="downloadImage">{{ $t('compress.download') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import pica from 'pica'

// 图片数据
const imageData = ref({
  original: null,
  compressed: null
})

// 压缩设置
const compressQuality = ref(80)
const compressMaxWidth = ref(1200)

// 处理文件上传
const handleFileChange = (file) => {
  if (!file || !file.raw) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      imageData.value = {
        original: {
          file: file.raw,
          url: e.target.result,
          width: img.width,
          height: img.height,
          size: file.raw.size
        },
        compressed: null
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 压缩图片
const compressImage = async () => {
  if (!imageData.value.original) {
    ElMessage.warning($t('compress.uploadFirst'))
    return
  }
  
  try {
    const img = new Image()
    img.src = imageData.value.original.url
    
    await new Promise((resolve) => {
      img.onload = resolve
    })
    
    // 计算新尺寸
    let newWidth = img.width
    let newHeight = img.height
    
    if (newWidth > compressMaxWidth.value) {
      const ratio = compressMaxWidth.value / newWidth
      newWidth = compressMaxWidth.value
      newHeight = Math.round(newHeight * ratio)
    }
    
    // 创建Canvas
    const canvas = document.createElement('canvas')
    canvas.width = newWidth
    canvas.height = newHeight
    
    // 使用pica进行高质量缩放
    const picaInstance = new pica()
    await picaInstance.resize(img, canvas)
    
    // 转换为Blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', compressQuality.value / 100)
    })
    
    // 更新压缩后的图片信息
    imageData.value.compressed = {
      url: URL.createObjectURL(blob),
      width: newWidth,
      height: newHeight,
      size: blob.size
    }
    
    ElMessage.success($t('compress.success'))
  } catch (error) {
    console.error('压缩图片时出错:', error)
    ElMessage.error($t('compress.fail'))
  }
}

// 下载压缩后的图片
const downloadImage = () => {
  if (!imageData.value.compressed) return
  
  const link = document.createElement('a')
  link.href = imageData.value.compressed.url
  link.download = '压缩_' + imageData.value.original.file.name
  link.click()
}

// 文件大小格式化
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

// 计算压缩率
const calculateCompressionRate = () => {
  if (!imageData.value.original || !imageData.value.compressed) return 0
  const originalSize = imageData.value.original.size
  const compressedSize = imageData.value.compressed.size
  return Math.round((1 - compressedSize / originalSize) * 100)
}
</script>

<style scoped>
.compress-view h2 {
  margin-bottom: 20px;
  color: #409eff;
}

.tool-container {
  margin-top: 20px;
}

/* 上传区域样式 */
.upload-area {
  margin-bottom: 30px;
}

.upload-component {
  width: 100%;
}

/* 图片预览容器样式 */
.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.image-preview {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin: 10px 0;
  border: 1px solid #ebeef5;
}

.image-info {
  width: 100%;
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

/* 压缩控制区域样式 */
.compression-controls {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-top: -15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .image-preview-container {
    flex-direction: column;
  }
  
  .image-preview,
  .compression-controls {
    min-width: 100%;
  }
}
</style>