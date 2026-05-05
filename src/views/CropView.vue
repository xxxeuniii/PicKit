<template>
  <!-- 图片裁剪 -->
  <div class="crop-container">
    <div class="card-header">
      <h2>{{ $t('menu.crop') }}</h2>
    </div>

    <div class="upload-area" v-if="!imageUrl">
      <el-upload class="upload-box" drag action="" :auto-upload="false" :show-file-list="false"
        :on-change="handleFileChange">
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          {{ $t('crop.uploadText') }} <em>{{ $t('crop.clickUpload') }}</em>
        </div>
        <div class="upload-tip">
          {{ $t('crop.supportedFormats') }}
        </div>
      </el-upload>
    </div>

    <div v-if="imageUrl" class="crop-workspace">
      <div class="crop-area">
        <div class="cropper-container">
          <img ref="cropperImage" :src="imageUrl" style="display: none;" />
        </div>
      </div>

      <div class="crop-controls">
        <div class="aspect-ratio-controls">
          <span class="control-label">{{ $t('crop.aspectRatio') }}：</span>
          <el-radio-group v-model="aspectRatio" @change="updateCropperAspectRatio">
            <el-radio-button label="free">{{ $t('crop.aspectRatios.free') }}</el-radio-button>
            <el-radio-button label="1:1">1:1</el-radio-button>
            <el-radio-button label="4:3">4:3</el-radio-button>
            <el-radio-button label="16:9">16:9</el-radio-button>
          </el-radio-group>
        </div>

        <div class="rotation-controls">
          <span class="control-label">{{ $t('crop.rotation') }}：</span>
          <el-button-group>
            <el-button @click="rotateCropper(-90)" type="primary" plain>
              <el-icon>
                <Refresh />
              </el-icon> {{ $t('crop.rotateLeft') }}
            </el-button>
            <el-button @click="rotateCropper(90)" type="primary" plain>
              <el-icon>
                <RefreshRight />
              </el-icon> {{ $t('crop.rotateRight') }}
            </el-button>
          </el-button-group>
        </div>

        <div class="flip-controls">
          <span class="control-label">{{ $t('crop.flip') }}：</span>
          <el-button-group>
            <el-button @click="flipCropperHorizontal" type="primary" plain>
              <el-icon>
                <DCaret />
              </el-icon> {{ $t('crop.flipHorizontal') }}
            </el-button>
            <el-button @click="flipCropperVertical" type="primary" plain>
              <el-icon>
                <DCaret class="vertical-icon" />
              </el-icon> {{ $t('crop.flipVertical') }}
            </el-button>
          </el-button-group>
        </div>

        <div class="action-buttons">
          <el-button @click="resetImage" plain type="info">
            <el-icon>
              <RefreshLeft />
            </el-icon> {{ $t('crop.reset') }}
          </el-button>
          <el-button @click="cropImage" type="success">
            <el-icon>
              <Crop />
            </el-icon> {{ $t('crop.cropButton') }}
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="croppedImageUrl" class="result-preview">
      <h3>{{ $t('crop.result') }}</h3>
      <div class="preview-image">
        <img :src="croppedImageUrl" :alt="$t('crop.croppedImage')" />
      </div>
      <div class="download-actions">
        <el-button type="primary" @click="downloadCroppedImage">
          <el-icon>
            <Download />
          </el-icon> {{ $t('crop.downloadButton') }}
        </el-button>
        <el-button @click="resetAll">
          <el-icon>
            <Delete />
          </el-icon> {{ $t('crop.clearAndRestart') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
 import { UploadFilled, Refresh, RefreshRight, RefreshLeft, DCaret, Crop, Download, Delete } from '@element-plus/icons-vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';


import { useI18n } from "vue-i18n";

const { t } = useI18n();
const imageUrl = ref('');
const cropperImage = ref(null);
const croppedImageUrl = ref('');
const aspectRatio = ref('free');
const cropper = ref(null);
const originalFile = ref(null);

const handleFileChange = (file) => {
  if (!file) return;

  originalFile.value = file.raw;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
    setTimeout(() => {
      initCropper();
    }, 20);
  };
  reader.readAsDataURL(file.raw);
};

const initCropper = () => {
  if (cropper.value) {
    cropper.value.destroy();
  }

  cropper.value = new Cropper(cropperImage.value, {
    aspectRatio: getAspectRatioValue(),
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.8,
    restore: false,
    modal: true,
    guides: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
  });
};

const getAspectRatioValue = () => {
  switch (aspectRatio.value) {
    case '1:1': return 1;
    case '4:3': return 4 / 3;
    case '16:9': return 16 / 9;
    default: return NaN;
  }
};

const updateCropperAspectRatio = () => {
  if (cropper.value) {
    cropper.value.setAspectRatio(getAspectRatioValue());
  }
};

const rotateCropper = (degree) => {
  if (cropper.value) {
    cropper.value.rotate(degree);
  }
};

const flipCropperHorizontal = () => {
  if (cropper.value) {
    cropper.value.scaleX(cropper.value.getData().scaleX * -1);
  }
};

const flipCropperVertical = () => {
  if (cropper.value) {
    cropper.value.scaleY(cropper.value.getData().scaleY * -1);
  }
};

const cropImage = () => {
  if (!cropper.value) return;

  const canvas = cropper.value.getCroppedCanvas({
    maxWidth: 4096,
    maxHeight: 4096,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  });

  if (canvas) {
    croppedImageUrl.value = canvas.toDataURL(originalFile.value.type || 'image/jpeg');
  }
};

const downloadCroppedImage = () => {
  if (!croppedImageUrl.value) return;

  const link = document.createElement('a');
  link.download = `cropped-${originalFile.value.name || 'image'}`;
  link.href = croppedImageUrl.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const resetImage = () => {
  if (cropper.value) {
    cropper.value.reset();
  }
};

const resetAll = () => {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
  imageUrl.value = '';
  croppedImageUrl.value = '';
  originalFile.value = null;
};

onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
});
</script>

<style scoped>
.card-header h2 {
  color: #409eff;
}

.crop-container {
  padding: 20px;
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

.upload-box {
  width: 100%;
  max-width: 500px;
}

.upload-tip {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.crop-workspace {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.crop-area {
  width: 100%;
  height: 50vh;
  max-height: 800px;
  min-height: 400px;
  overflow: hidden;
  margin: 0 auto;
}

.cropper-container {
  width: 100%;
  height: 100%;
}

.cropper-container img {
  max-width: 100%;
}

.crop-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.control-label {
  display: inline-block;
  width: 80px;
  font-weight: bold;
}

.aspect-ratio-controls,
.rotation-controls,
.flip-controls,
.action-buttons {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.action-buttons {
  justify-content: center;
  margin-top: 10px;
}

.result-preview {
  margin-top: 30px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  margin: 15px auto;
  border-radius: 4px;
  overflow: hidden;
}

.preview-image img {
  max-width: 100%;
  display: block;
}

.download-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.vertical-icon {
  transform: rotate(90deg);
}

@media (max-width: 768px) {
  .crop-container {
    padding: 10px;
  }

  .crop-area {
    height: 50vh;
    min-height: 300px;
  }

  .aspect-ratio-controls,
  .rotation-controls,
  .flip-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-label {
    margin-bottom: 5px;
  }
}
</style>
