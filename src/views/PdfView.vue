<template>
  <div class="pdf-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <h2>{{ $t('pdf.title') }}</h2>
          <p>{{ $t('pdf.description') }}</p>
        </div>
      </template>

      <div class="upload-section">
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          multiple
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept="image/*"
          list-type="picture-card"
          :on-remove="handleRemove"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ $t('pdf.upload.text') }}
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('pdf.upload.tip') }}
            </div>
          </template>
        </el-upload>
      </div>

      <div v-if="fileList.length > 0" class="settings-section">
        <el-divider>{{ $t('pdf.settings.title') }}</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('pdf.settings.pageSize')">
              <el-select v-model="pdfSettings.pageSize" style="width: 100%">
                <el-option label="A4" value="a4"></el-option>
                <el-option label="A3" value="a3"></el-option>
                <el-option label="Letter" value="letter"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item :label="$t('pdf.settings.orientation')">
              <el-select v-model="pdfSettings.orientation" style="width: 100%">
                <el-option :label="$t('pdf.settings.portrait')" value="portrait"></el-option>
                <el-option :label="$t('pdf.settings.landscape')" value="landscape"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item :label="$t('pdf.settings.imagesPerPage')">
              <el-select v-model="pdfSettings.imagesPerPage" style="width: 100%">
                <el-option label="1" :value="1"></el-option>
                <el-option label="2" :value="2"></el-option>
                <el-option label="4" :value="4"></el-option>
                <el-option label="6" :value="6"></el-option>
                <el-option label="9" :value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('pdf.settings.margin')">
              <el-slider
                v-model="pdfSettings.margin"
                :min="0"
                :max="50"
                :step="5"
                show-input
                :format-tooltip="(val) => val + 'mm'"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="$t('pdf.settings.quality')">
              <el-slider
                v-model="pdfSettings.quality"
                :min="0.1"
                :max="1"
                :step="0.1"
                show-input
                :format-tooltip="(val) => Math.round(val * 100) + '%'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div v-if="fileList.length > 0" class="action-section">
        <el-button
          type="primary"
          size="large"
          :loading="isGenerating"
          @click="generatePDF"
          :disabled="fileList.length === 0"
        >
          <el-icon><Document /></el-icon>
          {{ $t('pdf.generate') }}
        </el-button>
        
        <el-button
          size="large"
          @click="clearFiles"
        >
          {{ $t('common.clear') }}
        </el-button>
      </div>

      <div v-if="previewImages.length > 0" class="preview-section">
        <el-divider>{{ $t('pdf.preview') }}</el-divider>
        <div class="image-grid">
          <div
            v-for="(image, index) in previewImages"
            :key="index"
            class="image-item"
            :style="{ order: image.order }"
          >
            <img :src="image.url" :alt="`Image ${index + 1}`" />
            <div class="image-controls">
              <el-button-group>
                <el-button size="small" @click="moveUp(index)" :disabled="index === 0">
                  <el-icon><ArrowUp /></el-icon>
                </el-button>
                <el-button size="small" @click="moveDown(index)" :disabled="index === previewImages.length - 1">
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { jsPDF } from 'jspdf'

const uploadRef = ref()
const fileList = ref([])
const previewImages = ref([])
const isGenerating = ref(false)

const pdfSettings = reactive({
  pageSize: 'a4',
  orientation: 'portrait',
  imagesPerPage: 1,
  margin: 10,
  quality: 0.8
})

const handleFileChange = (file, files) => {
  fileList.value = files
  loadPreviewImages()
}

const handleRemove = (file, files) => {
  fileList.value = files
  loadPreviewImages()
}

const loadPreviewImages = () => {
  previewImages.value = []
  
  fileList.value.forEach((file, index) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImages.value.push({
        url: e.target.result,
        file: file.raw,
        order: index
      })
    }
    reader.readAsDataURL(file.raw)
  })
}

const moveUp = (index) => {
  if (index > 0) {
    const temp = previewImages.value[index]
    previewImages.value[index] = previewImages.value[index - 1]
    previewImages.value[index - 1] = temp
    
    // 更新order
    previewImages.value[index].order = index
    previewImages.value[index - 1].order = index - 1
  }
}

const moveDown = (index) => {
  if (index < previewImages.value.length - 1) {
    const temp = previewImages.value[index]
    previewImages.value[index] = previewImages.value[index + 1]
    previewImages.value[index + 1] = temp
    
    // 更新order
    previewImages.value[index].order = index
    previewImages.value[index + 1].order = index + 1
  }
}

const clearFiles = () => {
  fileList.value = []
  previewImages.value = []
  uploadRef.value.clearFiles()
}

const generatePDF = async () => {
  if (previewImages.value.length === 0) {
    ElMessage.warning('请先上传图片')
    return
  }

  isGenerating.value = true
  
  try {
    const pdf = new jsPDF({
      orientation: pdfSettings.orientation,
      unit: 'mm',
      format: pdfSettings.pageSize
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = pdfSettings.margin
    const availableWidth = pageWidth - 2 * margin
    const availableHeight = pageHeight - 2 * margin

    // 根据每页图片数量计算布局
    const { cols, rows } = getGridLayout(pdfSettings.imagesPerPage)
    const imageWidth = availableWidth / cols
    const imageHeight = availableHeight / rows

    let currentPage = 0
    let imageIndex = 0

    // 排序图片
    const sortedImages = [...previewImages.value].sort((a, b) => a.order - b.order)

    for (let i = 0; i < sortedImages.length; i += pdfSettings.imagesPerPage) {
      if (currentPage > 0) {
        pdf.addPage()
      }

      const pageImages = sortedImages.slice(i, i + pdfSettings.imagesPerPage)
      
      for (let j = 0; j < pageImages.length; j++) {
        const image = pageImages[j]
        const row = Math.floor(j / cols)
        const col = j % cols
        
        const x = margin + col * imageWidth
        const y = margin + row * imageHeight

        // 加载图片并添加到PDF
        await addImageToPDF(pdf, image.url, x, y, imageWidth, imageHeight)
      }

      currentPage++
    }

    // 保存PDF
    const fileName = `images_to_pdf_${new Date().getTime()}.pdf`
    pdf.save(fileName)
    
    ElMessage.success('PDF生成成功！')
  } catch (error) {
    console.error('PDF生成失败:', error)
    ElMessage.error('PDF生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

const getGridLayout = (imagesPerPage) => {
  const layouts = {
    1: { cols: 1, rows: 1 },
    2: { cols: 1, rows: 2 },
    4: { cols: 2, rows: 2 },
    6: { cols: 2, rows: 3 },
    9: { cols: 3, rows: 3 }
  }
  return layouts[imagesPerPage] || { cols: 1, rows: 1 }
}

const addImageToPDF = (pdf, imageUrl, x, y, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      // 计算图片缩放比例，保持宽高比
      const imgRatio = img.width / img.height
      const containerRatio = maxWidth / maxHeight
      
      let width, height
      if (imgRatio > containerRatio) {
        width = maxWidth
        height = maxWidth / imgRatio
      } else {
        height = maxHeight
        width = maxHeight * imgRatio
      }
      
      // 居中显示
      const centerX = x + (maxWidth - width) / 2
      const centerY = y + (maxHeight - height) / 2
      
      pdf.addImage(img, 'JPEG', centerX, centerY, width, height, undefined, 'FAST')
      resolve()
    }
    img.src = imageUrl
  })
}
</script>

<style scoped>
.pdf-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.card-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.upload-section {
  margin: 20px 0;
}

.settings-section {
  margin: 30px 0;
}

.action-section {
  text-align: center;
  margin: 30px 0;
}

.action-section .el-button {
  margin: 0 10px;
}

.preview-section {
  margin-top: 30px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.image-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  padding: 5px;
}

.image-controls .el-button {
  background: transparent;
  border: none;
  color: white;
  padding: 5px;
}

.image-controls .el-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.el-upload-dragger) {
  width: 100%;
  height: 200px;
}

:deep(.el-upload-list--picture-card) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

:deep(.el-upload-list__item) {
  width: auto;
  height: 150px;
}
</style>