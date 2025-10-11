<template>
  <div class="pdf-container">
    <el-row :gutter="20">
      <!-- 左侧设置面板 -->
      <el-col :span="12" :xs="24" :sm="24" :md="12">
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
              class="upload-demo fixed-width-upload"
              drag
              multiple
              :auto-upload="false"
              :on-change="handleFileChange"
              :file-list="[]"
              accept="image/*"
              :show-file-list="false"
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

          <!-- 已上传图片预览区域 -->
          <div v-if="previewImages.length > 0" class="uploaded-images-section">
            <el-divider>{{ $t('pdf.uploadedImages') }}</el-divider>
            <div class="uploaded-images-grid">
              <div
                v-for="(image, index) in previewImages"
                :key="index"
                class="uploaded-image-item"
              >
                <div class="image-wrapper">
                  <img :src="image.url" :alt="`Image ${index + 1}`" class="uploaded-image" />
                  <div class="uploaded-image-overlay">
                    <div class="image-controls">
                      <el-button-group size="small">
                        <el-button 
                          size="small" 
                          @click="moveImageUp(index)" 
                          :disabled="index === 0"
                          type="primary"
                          :icon="ArrowUp"
                        />
                        <el-button 
                          size="small" 
                          @click="moveImageDown(index)" 
                          :disabled="index === previewImages.length - 1"
                          type="primary"
                          :icon="ArrowDown"
                        />
                        <el-button 
                          size="small" 
                          @click="removeImage(index)"
                          type="danger"
                          :icon="Delete"
                        />
                      </el-button-group>
                    </div>
                    <div class="image-index">{{ index + 1 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="fileList.length > 0" class="settings-section">
            <el-divider>{{ $t('pdf.settings.title') }}</el-divider>
            
            <el-form label-position="top">
              <el-form-item :label="$t('pdf.settings.pageSize')">
                <el-select v-model="pdfSettings.pageSize" style="width: 100%" @change="updatePreview">
                  <el-option label="A4" value="a4"></el-option>
                  <el-option label="A3" value="a3"></el-option>
                  <el-option label="Letter" value="letter"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item :label="$t('pdf.settings.orientation')">
                <el-select v-model="pdfSettings.orientation" style="width: 100%" @change="updatePreview">
                  <el-option :label="$t('pdf.settings.portrait')" value="portrait"></el-option>
                  <el-option :label="$t('pdf.settings.landscape')" value="landscape"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item :label="$t('pdf.settings.imagesPerPage')">
                <el-select v-model="pdfSettings.imagesPerPage" style="width: 100%" @change="updatePreview">
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="2" :value="2"></el-option>
                  <el-option label="4" :value="4"></el-option>
                  <el-option label="6" :value="6"></el-option>
                  <el-option label="9" :value="9"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('pdf.settings.margin')">
                <el-slider
                  v-model="pdfSettings.margin"
                  :min="0"
                  :max="50"
                  :step="5"
                  show-input
                  :format-tooltip="(val) => val + 'mm'"
                  @change="updatePreview"
                />
              </el-form-item>
              
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
            </el-form>
          </div>

          <div v-if="fileList.length > 0" class="action-section">
            <el-button
              type="primary"
              size="large"
              :loading="isGenerating"
              @click="generatePDF"
              :disabled="fileList.length === 0"
              style="width: 100%; margin-bottom: 10px;"
            >
              <el-icon><Document /></el-icon>
              {{ $t('pdf.generate') }}
            </el-button>
            
            <el-button
              size="large"
              @click="clearFiles"
              style="width: 100%;"
            >
              {{ $t('common.clear') }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧实时预览面板 -->
      <el-col :span="12" :xs="24" :sm="24" :md="12">
        <el-card shadow="never" v-if="previewImages.length > 0">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('pdf.preview') }}</h3>
              <p>{{ $t('pdf.previewDescription') }}</p>
            </div>
          </template>

          <div class="pdf-preview-container">
            <div 
              v-for="(page, pageIndex) in paginatedImages" 
              :key="pageIndex" 
              class="pdf-page-preview"
              :class="{ 
                'landscape': pdfSettings.orientation === 'landscape',
                'portrait': pdfSettings.orientation === 'portrait'
              }"
              :style="getPageStyle()"
            >
              <div class="page-header">
                <span class="page-number">{{ $t('pdf.page') }} {{ pageIndex + 1 }}</span>
              </div>
              
              <div 
                class="page-content"
                :style="getContentStyle()"
              >
                <div 
                  class="image-grid-preview"
                  :style="getGridStyle()"
                >
                  <div
                    v-for="(image, imageIndex) in page"
                    :key="imageIndex"
                    class="image-slot"
                    :style="getImageSlotStyle()"
                  >
                    <img 
                      :src="image.url" 
                      :alt="`Image ${imageIndex + 1}`"
                      class="preview-image"
                      :style="getPreviewImageStyle()"
                    />
                    <div class="image-controls">
                      <el-button-group size="small">
                        <el-button 
                          size="small" 
                          @click="moveImageUp(pageIndex * pdfSettings.imagesPerPage + imageIndex)" 
                          :disabled="pageIndex * pdfSettings.imagesPerPage + imageIndex === 0"
                        >
                          <el-icon><ArrowUp /></el-icon>
                        </el-button>
                        <el-button 
                          size="small" 
                          @click="moveImageDown(pageIndex * pdfSettings.imagesPerPage + imageIndex)" 
                          :disabled="pageIndex * pdfSettings.imagesPerPage + imageIndex === previewImages.length - 1"
                        >
                          <el-icon><ArrowDown /></el-icon>
                        </el-button>
                      </el-button-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 预览空状态 -->
        <el-card shadow="never" v-else>
          <template #header>
            <div class="card-header">
              <h3>{{ $t('pdf.preview') }}</h3>
              <p>{{ $t('pdf.previewDescription') }}</p>
            </div>
          </template>
          <el-empty description="暂无预览内容，请先在左侧上传图片">
            <el-button type="primary" @click="scrollToUpload">去上传</el-button>
          </el-empty>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, ArrowUp, ArrowDown, Delete } from '@element-plus/icons-vue'
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

// 页面尺寸配置（毫米）
const pageSizes = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  letter: { width: 216, height: 279 }
}

// 计算属性：分页后的图片
const paginatedImages = computed(() => {
  const pages = []
  const imagesPerPage = pdfSettings.imagesPerPage
  
  for (let i = 0; i < previewImages.value.length; i += imagesPerPage) {
    pages.push(previewImages.value.slice(i, i + imagesPerPage))
  }
  
  return pages
})

// 获取页面样式
const getPageStyle = () => {
  const size = pageSizes[pdfSettings.pageSize]
  const isLandscape = pdfSettings.orientation === 'landscape'
  
  const width = isLandscape ? size.height : size.width
  const height = isLandscape ? size.width : size.height
  
  // 按比例缩放到合适的预览尺寸
  const scale = 0.8
  const scaledWidth = (width * scale) + 'px'
  const scaledHeight = (height * scale) + 'px'
  
  return {
    width: scaledWidth,
    height: scaledHeight,
    aspectRatio: `${width}/${height}`,
    border: '1px solid #dcdfe6',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    position: 'relative'
  }
}

// 获取内容区域样式
const getContentStyle = () => {
  const size = pageSizes[pdfSettings.pageSize]
  const isLandscape = pdfSettings.orientation === 'landscape'
  const pageWidth = isLandscape ? size.height : size.width
  const pageHeight = isLandscape ? size.width : size.height
  
  // 使用与PDF生成相同的缩放比例计算
  const scale = 0.8
  const scaledPageWidth = pageWidth * scale
  const scaledPageHeight = pageHeight * scale
  
  // 计算边距的像素值（基于缩放后的页面尺寸）
  const marginRatio = pdfSettings.margin / pageWidth  // 边距占页面宽度的比例
  const marginPx = (scaledPageWidth * marginRatio) + 'px'
  
  return {
    padding: marginPx,
    height: '100%',
    boxSizing: 'border-box'
  }
}

// 获取网格样式
const getGridStyle = () => {
  const imagesPerPage = pdfSettings.imagesPerPage
  const { cols, rows } = getGridLayout(imagesPerPage)
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: '4px',
    height: '100%'
  }
}

const getGridLayout = (imagesPerPage) => {
  const layouts = {
    1: { cols: 1, rows: 1 },
    2: { cols: 2, rows: 1 },
    4: { cols: 2, rows: 2 },
    6: { cols: 3, rows: 2 },
    9: { cols: 3, rows: 3 }
  }
  return layouts[imagesPerPage] || { cols: 1, rows: 1 }
}

// 获取图片槽样式 - 添加图片保持宽高比的样式
const getImageSlotStyle = () => {
  return {
    position: 'relative',
    border: '1px dashed #dcdfe6',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

// 获取预览图片样式 - 确保图片在预览中也保持宽高比
const getPreviewImageStyle = () => {
  return {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '2px'
  }
}

// 更新预览
const updatePreview = () => {
  // 触发响应式更新
  nextTick(() => {
    // 预览会自动更新，因为使用了计算属性
  })
}

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

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  fileList.value.splice(index, 1)
}

const moveImageUp = (index) => {
  if (index > 0) {
    const temp = previewImages.value[index]
    previewImages.value[index] = previewImages.value[index - 1]
    previewImages.value[index - 1] = temp
    
    // 更新order
    previewImages.value[index].order = index
    previewImages.value[index - 1].order = index - 1
  }
}

const moveImageDown = (index) => {
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
    const size = pageSizes[pdfSettings.pageSize]
    const isLandscape = pdfSettings.orientation === 'landscape'
    
    const pageWidth = isLandscape ? size.height : size.width
    const pageHeight = isLandscape ? size.width : size.height
    
    const pdf = new jsPDF({
      orientation: pdfSettings.orientation,
      unit: 'mm',
      format: [pageWidth, pageHeight]
    })

    const margin = pdfSettings.margin
    const contentWidth = pageWidth - 2 * margin
    const contentHeight = pageHeight - 2 * margin

    const { cols, rows } = getGridLayout(pdfSettings.imagesPerPage)
    const imageWidth = contentWidth / cols
    const imageHeight = contentHeight / rows

    let currentPage = 0
    
    for (let i = 0; i < previewImages.value.length; i += pdfSettings.imagesPerPage) {
      if (currentPage > 0) {
        pdf.addPage()
      }

      const pageImages = previewImages.value.slice(i, i + pdfSettings.imagesPerPage)
      
      for (let j = 0; j < pageImages.length; j++) {
        const image = pageImages[j]
        const row = Math.floor(j / cols)
        const col = j % cols
        
        const x = margin + col * imageWidth
        const y = margin + row * imageHeight

        try {
          await addImageToPDF(pdf, image.url, x, y, imageWidth, imageHeight, pdfSettings.quality)
        } catch (error) {
          console.error('添加图片失败:', error)
        }
      }
      
      currentPage++
    }

    pdf.save('images-to-pdf.pdf')
    ElMessage.success('PDF生成成功！')
  } catch (error) {
    console.error('生成PDF失败:', error)
    ElMessage.error('生成PDF失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

const addImageToPDF = (pdf, imageUrl, x, y, maxWidth, maxHeight, quality) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        // 计算图片缩放比例，保持宽高比
        const imgRatio = img.width / img.height
        const containerRatio = maxWidth / maxHeight
        
        let width, height, offsetX = 0, offsetY = 0
        
        if (imgRatio > containerRatio) {
          // 图片更宽，以宽度为准
          width = maxWidth
          height = maxWidth / imgRatio
          offsetY = (maxHeight - height) / 2
        } else {
          // 图片更高，以高度为准
          height = maxHeight
          width = maxHeight * imgRatio
          offsetX = (maxWidth - width) / 2
        }
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.width
        canvas.height = img.height
        
        ctx.drawImage(img, 0, 0)
        
        const imgData = canvas.toDataURL('image/jpeg', quality)
        pdf.addImage(imgData, 'JPEG', x + offsetX, y + offsetY, width, height)
        resolve()
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = reject
    img.src = imageUrl
  })
}

const scrollToUpload = () => {
  const el = document.querySelector('.upload-section')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.pdf-container {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-demo {
  width: 100%;
}

.fixed-width-upload {
  width: 100%;
  max-width: 300px;
}

.fixed-width-upload .el-upload {
  width: 100%;
}

.fixed-width-upload .el-upload-dragger {
  width: 100%;
  height: 120px;
}

/* 已上传图片网格样式 */
.uploaded-images-section {
  margin-top: 20px;
}

.uploaded-images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.uploaded-image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
}

.uploaded-image-item .image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.uploaded-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
}

.uploaded-image-item:hover .uploaded-image-overlay {
  opacity: 1;
}

.uploaded-image-overlay .image-controls {
  position: static;
  opacity: 1;
}

.image-index {
  color: white;
  font-size: 12px;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 10px;
}

.settings-section {
  margin: 20px 0;
}

.action-section {
  margin-top: 20px;
}

.pdf-preview-container {
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
}

.pdf-page-preview {
  margin: 0 auto 20px auto;
  position: relative;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.pdf-page-preview.landscape {
  /* 横向页面样式 */
}

.pdf-page-preview.portrait {
  /* 纵向页面样式 */
}

.page-header {
  background: #f5f7fa;
  padding: 8px 16px;
  border-bottom: 1px solid #ebeef5;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.page-number {
  font-weight: 500;
}

.page-content {
  position: relative;
  background: white;
}

.image-grid-preview {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.image-slot {
  position: relative;
  min-height: 80px;
  transition: all 0.3s ease;
}

.image-slot:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.image-controls {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 2px;
}

.image-slot:hover .image-controls {
  opacity: 1;
}

.image-controls .el-button {
  padding: 4px;
  margin: 0 1px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .pdf-container {
    padding: 10px;
  }
  
  .pdf-page-preview {
    transform: scale(0.7);
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .pdf-page-preview {
    transform: scale(0.5);
    margin-bottom: 5px;
  }
  
  .pdf-preview-container {
    max-height: 50vh;
  }
}

/* 滚动条样式 */
.pdf-preview-container::-webkit-scrollbar {
  width: 6px;
}

.pdf-preview-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.pdf-preview-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.pdf-preview-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 加载状态 */
.el-button.is-loading {
  pointer-events: none;
}

/* 表单样式优化 */
.el-form-item {
  margin-bottom: 18px;
}

.el-form-item__label {
  font-weight: 500;
  color: #606266;
}

/* 上传组件样式 */
.upload-demo .el-upload-dragger {
  width: 100%;
  height: 180px;
}

.upload-demo .el-upload-list {
  margin-top: 10px;
}

/* 卡片样式 */
.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-card__header {
  padding: 20px 20px 0 20px;
}

.el-card__body {
  padding: 20px;
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

/* 追加移动端适配样式 */
@media (max-width: 768px) {
  .pdf-container {
    padding: 10px;
  }
  .fixed-width-upload {
    max-width: 100%;
  }
  .uploaded-images-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 100%;
  }
  .action-section {
    margin-top: 12px;
  }
  .el-card__header {
    padding: 12px 12px 0 12px;
  }
  .el-card__body {
    padding: 12px;
  }
  .pdf-preview-container {
    max-height: 55vh;
    padding: 8px;
  }
}
</style>