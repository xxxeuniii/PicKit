<template>
  <!-- 图片压缩 -->
  <div class="compress-view">
    <div class="card-header">
      <h2>{{ $t('menu.compress') }}</h2>
    </div>

    <div class="tool-container">
      <div class="upload-area">
        <el-upload class="upload-component" drag action="#" :auto-upload="false" :on-change="handleFileChange"
          :show-file-list="false">
          <el-icon class="el-icon--upload">
            <Upload />
          </el-icon>
          <div class="el-upload__text">{{ $t('compress.uploadText') }} <em>{{ $t('compress.clickUpload') }}</em></div>
          <div class="upload-tip">{{ $t('compress.supportedFormats') }}</div>
        </el-upload>
      </div>

      <div v-if="imageData.original" class="image-preview-container">
        <div class="image-preview">
          <h3>{{ $t('compress.originalImage') }}</h3>
          <img :src="imageData.original.url" :alt="$t('compress.originalImage')" class="preview-img">
          <div class="image-info">
            <p>{{ $t('compress.dimensions') }}: {{ imageData.original.width }} x {{ imageData.original.height }} px</p>
            <p>{{ $t('compress.size') }}: {{ formatFileSize(imageData.original.size) }}</p>
          </div>
        </div>

        <div class="compression-controls">
          <h3>{{ $t('compress.compressionSettings') }}</h3>
          <el-form label-position="top">
            <el-form-item :label="$t('compress.quality')">
              <el-slider v-model="compressQuality" :min="10" :max="100" :step="5" show-stops></el-slider>
              <div class="quality-tip">质量越高，图片越清晰，文件越大</div>
            </el-form-item>
            <el-form-item :label="$t('compress.maxWidth')">
              <el-input-number v-model="compressMaxWidth" :min="100" :step="100"></el-input-number>
              <div class="width-tip">图片宽度超过设定值时会等比例缩小</div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="compressImage">{{ $t('compress.compressButton') }}</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-if="imageData.compressed" class="image-preview">
          <h3>{{ $t('compress.compressed') }}</h3>
          <img :src="imageData.compressed.url" :alt="$t('compress.compressed')" class="preview-img">
          <div class="image-info">
            <p>{{ $t('compress.dimensions') }}: {{ imageData.compressed.width }} x {{ imageData.compressed.height }} px</p>
            <p>{{ $t('compress.size') }}: {{ formatFileSize(imageData.compressed.size) }}</p>
            <p>{{ $t('compress.compressionRate') }}: {{ calculateCompressionRate() }}%</p>
          </div>
          <el-button type="success" @click="downloadImage">{{ $t('compress.downloadButton') }}</el-button>
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
      compressMaxWidth.value = img.width
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 压缩图片
const compressImage = async () => {
  if (!imageData.value.original) {
    ElMessage.warning(t('compress.uploadWarning'))
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

    ElMessage.success(t('compress.successMessage'))
  } catch (error) {
    console.error('压缩图片时出错:', error)
    ElMessage.error(t('compress.errorMessage'))
  }
}

// 下载压缩后的图片
const downloadImage = () => {
  if (!imageData.value.compressed) return

  const link = document.createElement('a')
  link.href = imageData.value.compressed.url
  link.download = t('compress.downloadPrefix') + imageData.value.original.file.name
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
.compress-view {
  padding: 20px;
}

.card-header h2 {
  color: #409eff;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.tool-container {
  margin-top: 20px;
}

.upload-area {
  margin-bottom: 30px;
}

.upload-component {
  width: 100%;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.quality-tip,
.width-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.image-preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.image-preview {
  flex: 1;
  min-width: 300px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.preview-img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin: 10px 0;
}

.image-info {
  width: 100%;
  margin: 10px 0;
  font-size: 14px;
  color: #606266;
}

.compression-controls {
  flex: 1;
  min-width: 300px;
  padding: 15px;
}

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
