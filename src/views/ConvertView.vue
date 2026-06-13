<template>
  <!-- 图片处理 -->
  <div class="convert-container">
    <div class="upload-area" v-if="!imageUrl">
      <el-upload class="upload-component" drag action="#" :auto-upload="false" :show-file-list="false"
        :on-change="handleFileChange" :multiple="false">
        <el-icon class="el-icon--upload">
          <Upload />
        </el-icon>
        <div class="el-upload__text">{{ $t('convert.uploadText') }} <em>{{ $t('convert.clickUpload') }}</em></div>
        <div class="upload-tip">{{ $t('convert.supportedFormats') }}</div>
      </el-upload>
    </div>

    <div v-if="imageUrl" class="convert-workspace">
      <div class="image-preview">
        <h3>{{ $t('convert.originalImage') }}</h3>
        <div class="preview-box">
          <img :src="imageUrl" :alt="$t('convert.originalImage')" />
        </div>
        <div class="image-info">
          <p><strong>{{ $t('convert.fileName') }}：</strong>{{ originalFileName }}</p>
          <p><strong>{{ $t('convert.originalFormat') }}：</strong>{{ originalFormat }}</p>
          <p><strong>{{ $t('convert.dimensions') }}：</strong>{{ imageWidth }} x {{ imageHeight }} {{
            $t('convert.pixels') }}
          </p>
        </div>
      </div>

      <div class="convert-controls">
        <div class="format-selection">
          <span class="control-label">{{ $t('convert.targetFormat') }}：</span>
          <el-radio-group v-model="targetFormat">
            <el-radio-button label="image/jpeg">JPG</el-radio-button>
            <el-radio-button label="image/png">PNG</el-radio-button>
            <el-radio-button label="image/webp">WEBP</el-radio-button>
            <el-radio-button label="image/gif" :disabled="!supportsGif">GIF</el-radio-button>
          </el-radio-group>
        </div>

        <div class="quality-control" v-if="targetFormat === 'image/jpeg' || targetFormat === 'image/webp'">
          <span class="control-label">{{ $t('convert.quality') }}：</span>
          <div class="quality-slider">
            <el-slider v-model="quality" :min="10" :max="100" :step="5" show-stops>
              <template #default="{ value }">
                <div class="slider-value">{{ value }}%</div>
              </template>
            </el-slider>
          </div>
        </div>

        <div class="action-buttons">
          <el-button @click="resetImage" plain type="info">
            <el-icon>
              <Delete />
            </el-icon> {{ $t('convert.clear') }}
          </el-button>
          <el-button @click="convertImage" type="primary">
            <el-icon>
              <RefreshRight />
            </el-icon> {{ $t('convert.convertButton') }}
          </el-button>
        </div>
      </div>

      <div class="result-preview" :class="{ 'is-empty': !convertedImageUrl }">
        <h3>{{ $t('convert.result') }}</h3>
        <div v-if="convertedImageUrl" class="preview-image">
          <img :src="convertedImageUrl" :alt="$t('convert.convertedImage')" />
        </div>
        <el-empty v-else :description="$t('convert.convertButton')" :image-size="72" />
        <div v-if="convertedImageUrl" class="download-actions">
          <el-button type="success" @click="downloadConvertedImage">
            <el-icon>
              <Download />
            </el-icon> {{ $t('convert.downloadButton') }}
          </el-button>
          <el-button @click="convertAnother">
            <el-icon>
              <Plus />
            </el-icon> {{ $t('convert.convertAnother') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Upload, RefreshRight, Delete, Download, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { useI18n } from "vue-i18n";

const { t } = useI18n();
const imageUrl = ref('');
const convertedImageUrl = ref('');
const targetFormat = ref('image/jpeg');
const quality = ref(85);
const originalFile = ref(null);
const originalFileName = ref('');
const imageWidth = ref(0);
const imageHeight = ref(0);

const originalFormat = computed(() => {
  if (!originalFile.value) return '';
  return originalFile.value.type || t('convert.unknownFormat');
});

const supportsGif = computed(() => {
  return originalFormat.value === 'image/gif';
});

const handleFileChange = (file) => {
  if (!file) return;

  originalFile.value = file.raw;
  originalFileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;

    const img = new Image();
    img.onload = () => {
      imageWidth.value = img.width;
      imageHeight.value = img.height;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const convertImage = () => {
  if (!imageUrl.value) return;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    try {
      const options = {};
      if (targetFormat.value === 'image/jpeg' || targetFormat.value === 'image/webp') {
        options.quality = quality.value / 100;
      }

      convertedImageUrl.value = canvas.toDataURL(targetFormat.value, options.quality);
      ElMessage.success(t('convert.successMessage'));
    } catch (error) {
      ElMessage.error(t('convert.errorMessage'));
      console.error('转换错误:', error);
    }
  };
  img.src = imageUrl.value;
};

const downloadConvertedImage = () => {
  if (!convertedImageUrl.value) return;

  const extension = targetFormat.value.split('/')[1];
  const fileName = originalFileName.value.split('.')[0] || 'converted';

  const link = document.createElement('a');
  link.download = `${fileName}.${extension}`;
  link.href = convertedImageUrl.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const resetImage = () => {
  imageUrl.value = '';
  convertedImageUrl.value = '';
  originalFile.value = null;
  originalFileName.value = '';
  imageWidth.value = 0;
  imageHeight.value = 0;
};

const convertAnother = () => {
  convertedImageUrl.value = '';
  imageUrl.value = '';
  originalFile.value = null;
  originalFileName.value = '';
  imageWidth.value = 0;
  imageHeight.value = 0;
};
</script>

<style scoped>
.card-header h2 {
  color: #409eff;
}

.convert-container {
  padding: 18px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.upload-area {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.upload-component {
  width: 100%;
  max-width: 500px;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.convert-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, .78fr) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}

.image-preview {
  text-align: center;
  margin-bottom: 0;
  padding: 18px;
}

.preview-box {
  max-width: 100%;
  max-height: 400px;
  overflow: hidden;
  margin: 0 auto;
  border-radius: 4px;
}

.preview-box img {
  max-width: 100%;
  max-height: 400px;
  display: block;
  margin: 0 auto;
}

.image-info {
  margin-top: 10px;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.convert-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 0;
  padding: 18px;
}

.control-label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

.format-selection,
.quality-control {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 10px;
  gap: 8px;
}

.quality-slider {
  width: 100%;
  margin-left: 0;
}

.slider-value {
  font-size: 12px;
  color: #606266;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 12px;
}

.result-preview {
  margin-top: 0;
  text-align: center;
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.preview-image {
  max-width: 100%;
  margin: 15px auto 0;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image img {
  max-width: 100%;
  max-height: 400px;
  display: block;
  margin: 0 auto;
}

.download-actions {
  margin-top: auto;
  padding-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

@media (max-width: 1024px) {
  .convert-workspace {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .convert-controls {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .convert-container {
    padding: 10px;
  }

  .convert-workspace {
    grid-template-columns: 1fr;
  }

  .convert-controls {
    grid-column: auto;
    grid-row: auto;
  }

  .control-label {
    margin-bottom: 5px;
  }

  .quality-slider {
    width: 100%;
    margin-left: 0;
  }
}
</style>
