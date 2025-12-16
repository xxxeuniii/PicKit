<template>
  <div class="batch-crop-container">
    <el-row :gutter="16">
      <!-- Left: Upload & Settings & Thumbnails -->
      <el-col :xs="24" :sm="24" :md="8" :lg="7">
        <div class="panel">
          <el-upload
            class="upload-area"
            drag
            multiple
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onUploadChange"
            :before-upload="() => false"
          >
            <el-icon class="el-icon--upload">
              <upload-filled></upload-filled>
            </el-icon>
            <div
              class="el-upload__text"
              v-html="$t('batchCrop.uploadText')"
            ></div>
            <div class="el-upload__tip">
              {{ $t("batchCrop.supportedFormats") }}
            </div>
          </el-upload>

          <el-divider></el-divider>

          <el-form
            label-width="120px"
            label-position="top"
            class="settings-form"
          >
            <el-form-item :label="$t('batchCrop.cropBoxSize')">
              <div class="size-inline">
                <div class="size-row">
                  <span class="size-label">{{ $t("batchCrop.width") }}：</span>
                  <el-input-number
                    size="small"
                    v-model="boxWidth"
                    :min="50"
                    :max="5000"
                    :step="10"
                    :controls="true"
                    @change="onSizeChanged"
                  ></el-input-number>
                </div>
                <div class="size-row">
                  <span class="size-label">{{ $t("batchCrop.height") }}：</span>
                  <el-input-number
                    size="small"
                    v-model="boxHeight"
                    :min="50"
                    :max="5000"
                    :step="10"
                    :controls="true"
                    @change="onSizeChanged"
                  ></el-input-number>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <template #label>
                <div class="reset-with-tip">
                  <span>{{ $t("batchCrop.lockResize") }}</span>
                  <el-tooltip
                    placement="top"
                    :content="$t('batchCrop.lockResizeTip')"
                  >
                    <el-icon class="reset-tip-icon">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
              <el-switch v-model="lockResize"></el-switch>
            </el-form-item>
          </el-form>

          <div class="actions">
            <el-button
              size="small"
              :disabled="cropped.length === 0"
              @click="downloadAllZip"
              >{{ $t("batchCrop.downloadAll") }}</el-button
            >
            <el-button
              size="small"
              @click="clearAll"
              :disabled="!hasImages && cropped.length === 0"
              >{{ $t("common.clear") }}</el-button
            >
            <div class="reset-with-tip">
              <el-button
                size="small"
                :disabled="!hasImages"
                @click="resetCropBox"
                >{{ $t("batchCrop.resetCropBox") }}</el-button
              >
              <el-tooltip
                placement="top"
                :content="$t('batchCrop.resetCropBoxTip')"
              >
                <el-icon class="reset-tip-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </div>

          <div v-if="!hasImages" class="empty-tip">
            {{ $t("batchCrop.noFiles") }}
          </div>

          <div v-else class="thumbs">
            <div class="thumbs-header">{{ currentName }}</div>
            <div class="thumbs-grid">
              <button
                v-for="(img, i) in images"
                :key="i"
                class="thumb"
                :class="{ active: i === currentIndex }"
                @click="switchTo(i)"
                :title="img.name"
              >
                <img :src="img.src" :alt="img.name" />
              </button>
            </div>
          </div>
        </div>
      </el-col>

      <!-- Right: Workspace & Results -->
      <el-col :xs="24" :sm="24" :md="15" :lg="16">
        <div class="panel">
          <div class="workspace-toolbar">
            <el-button size="small" :disabled="!hasImages" @click="prev">{{
              $t("batchCrop.prev")
            }}</el-button>
            <el-button size="small" :disabled="!hasImages" @click="next">{{
              $t("batchCrop.next")
            }}</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="!hasImages"
              @click="cropCurrent"
              >{{ $t("batchCrop.cropCurrent") }}</el-button
            >
            <el-button
              size="small"
              :disabled="!hasImages"
              @click="fitToContainer"
              >{{ $t("batchCrop.fitView") }}</el-button
            >
            <span class="file-name" v-if="hasImages">
              {{ $t("batchCrop.imageSizeLabel") }}：{{ currentSize }}
            </span>
          </div>
          <div class="workspace" :class="{ 'lock-resize-on': lockResize }">
            <img
              v-if="hasImages"
              ref="workspaceImage"
              :src="images[currentIndex].src"
              :alt="currentName"
            />
            <div v-else class="empty-workspace">—</div>
          </div>
        </div>

        <div class="panel">
          <div class="result-title">{{ $t("batchCrop.result") }}</div>
          <div v-if="cropped.length === 0" class="empty-tip">—</div>
          <div v-else class="grid">
            <div v-for="(img, idx) in cropped" :key="idx" class="grid-item">
              <el-image
                :src="img.dataUrl"
                :preview-src-list="croppedPreviewList"
                :initial-index="idx"
                fit="cover"
              />
              <div class="grid-item-footer">
                <div class="name" :title="img.name">{{ img.name }}</div>
                <el-button
                  class="download-btn"
                  size="small"
                  @click="downloadSingle(img)"
                  >下载</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, nextTick, computed } from "vue";
import { UploadFilled, QuestionFilled } from "@element-plus/icons-vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import JSZip from "jszip";

const images = ref([]);
const cropped = ref([]);
const currentIndex = ref(0);
const workspaceImage = ref(null);
const cropper = ref(null);
const applyingSizeChange = ref(false);
const boxHeight = ref(1000);
const boxWidth = ref(750);
const lockResize = ref(false);

const hasImages = ref(false);
const currentName = ref("");
const currentSize = ref("");
const croppedPreviewList = computed(() =>
  cropped.value.map((item) => item.dataUrl)
);

function onUploadChange(file, fileList) {
  const rawList = fileList.map((f) => f.raw).filter(Boolean);
  const unique = [];
  const seen = new Set();
  for (const f of rawList) {
    const key = `${f.name}-${f.size}-${f.lastModified}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(f);
    }
  }
  Promise.all(unique.map(readFileAsDataURL)).then((results) => {
    images.value = results.map((r) => ({
      name: r.name,
      type: r.type,
      src: r.dataUrl,
    }));
    currentIndex.value = 0;
    hasImages.value = images.value.length > 0;
    currentName.value = hasImages.value ? images.value[0].name : "";
    cropped.value = [];
    nextTick(initCropper);
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        name: file.name,
        type: file.type || "image/png",
        dataUrl: reader.result,
      });
    reader.readAsDataURL(file);
  });
}
function initCropper() {
  destroyCropper();
  if (!workspaceImage.value) return;

  cropper.value = new Cropper(workspaceImage.value, {
    viewMode: 1,
    autoCrop: true,
    dragMode: "move",
    background: false,
    zoomOnWheel: true,
    cropBoxResizable: true,
    ready() {
      setCropBoxSize();
      updateCurrentSize();
    },
  });
}

function setCropBoxSize() {
  if (!cropper.value) return;

  const containerData = cropper.value.getContainerData();
  const imageData = cropper.value.getImageData();

  // 将期望的自然像素尺寸转换为显示尺寸（容器坐标）
  const scaleX = imageData.width / imageData.naturalWidth || 1;
  const scaleY = imageData.height / imageData.naturalHeight || 1;

  const desiredW = Math.min(boxWidth.value, imageData.naturalWidth);
  const desiredH = Math.min(boxHeight.value, imageData.naturalHeight);

  const displayW = Math.min(Math.round(desiredW * scaleX), containerData.width);
  const displayH = Math.min(
    Math.round(desiredH * scaleY),
    containerData.height
  );

  const left = Math.max((containerData.width - displayW) / 2, 0);
  const top = Math.max((containerData.height - displayH) / 2, 0);

  cropper.value.setCropBoxData({
    left,
    top,
    width: displayW,
    height: displayH,
  });
}

function updateCurrentSize() {
  if (!cropper.value) return;
  const imageData = cropper.value.getImageData();
  const w = Math.round(imageData.naturalWidth || imageData.width || 0);
  const h = Math.round(imageData.naturalHeight || imageData.height || 0);
  currentSize.value = w && h ? `${w} × ${h}` : "";
}

function switchTo(i) {
  if (!hasImages.value) return;
  saveCurrentCropIfCropped();
  currentIndex.value = i;
  currentName.value = images.value[i].name;
  nextTick(initCropper);
}

function prev() {
  if (hasImages.value) switchTo(Math.max(0, currentIndex.value - 1));
}
function next() {
  if (hasImages.value)
    switchTo(Math.min(images.value.length - 1, currentIndex.value + 1));
}

function cropCurrent() {
  if (!cropper.value) return;
  const mime = images.value[currentIndex.value].type?.includes("jpeg")
    ? "image/jpeg"
    : "image/png";

  // 使用输入框宽高生成导出图片
  const canvas = cropper.value.getCroppedCanvas({
    width: boxWidth.value,
    height: boxHeight.value,
  });

  const dataUrl = canvas.toDataURL(mime, 0.92);
  const name = makeCroppedName(images.value[currentIndex.value].name, dataUrl);
  upsertCropped(currentIndex.value, { name, dataUrl });
}

// function cropCurrent() {
//   if (!cropper.value) return;
//   const mime = images.value[currentIndex.value].type?.includes("jpeg")
//     ? "image/jpeg"
//     : "image/png";
//   const canvas = cropper.value.getCroppedCanvas({
//     width: boxWidth.value,
//     height: boxHeight.value,
//   });
//   const dataUrl = canvas.toDataURL(mime, 0.92);
//   const name = makeCroppedName(images.value[currentIndex.value].name, dataUrl);
//   upsertCropped(currentIndex.value, { name, dataUrl });
// }

async function cropAll() {
  if (!hasImages.value) return;
  // Apply current crop box to each image by switching and cropping
  for (let i = 0; i < images.value.length; i++) {
    switchTo(i);
    await nextTick();
    cropCurrent();
  }
}

function upsertCropped(index, item) {
  const exists = cropped.value.findIndex((_, i) => i === index);
  if (exists >= 0) cropped.value[exists] = item;
  else cropped.value.push(item);
}

function saveCurrentCropIfCropped() {
  // Optional: could save cropBoxData per image for continuity (skipped for simplicity)
}

function makeCroppedName(originalName, dataUrl) {
  const ext = dataUrl.startsWith("data:image/jpeg") ? ".jpg" : ".png";
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}_cropped${ext}`;
}

function downloadSingle(item) {
  const a = document.createElement("a");
  a.href = item.dataUrl;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function downloadAllZip() {
  if (cropped.value.length === 0) return;
  const zip = new JSZip();
  for (const item of cropped.value) {
    const blob = dataURLtoBlob(item.dataUrl);
    zip.file(item.name, blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cropped_images.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 1. dataURL 转 Blob
function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

// 2. 同步输入框显示自然像素大小
function syncBoxInput(imageData) {
  if (!hasImages.value || !imageData) return;

  const scaleX = imageData.naturalWidth / imageData.width;
  const scaleY = imageData.naturalHeight / imageData.height;

  boxWidth.value = Math.round(imageData.width * scaleX);
  boxHeight.value = Math.round(imageData.height * scaleY);
}

function fitToContainer() {
  if (!cropper.value) return;
  const cd = cropper.value.getContainerData();
  const id = cropper.value.getImageData();
  const fitRatio = Math.min(
    cd.width / id.naturalWidth,
    cd.height / id.naturalHeight
  );
  cropper.value.zoomTo(fitRatio);
  const id2 = cropper.value.getImageData();
  const left = Math.round((cd.width - id2.width) / 2);
  const top = Math.round((cd.height - id2.height) / 2);
  cropper.value.setCanvasData({ left, top });
  setCropBoxSize();
}

function resetCropBox() {
  if (!cropper.value) return;
  const imageData = cropper.value.getImageData();
  applyingSizeChange.value = true;
  boxWidth.value = Math.round(imageData.naturalWidth);
  boxHeight.value = Math.round(imageData.naturalHeight);
  setCropBoxSize();
  nextTick(() => {
    applyingSizeChange.value = false;
  });
}
function destroyCropper() {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
}

onBeforeUnmount(destroyCropper);
// function onSizeChanged() {
//   // 同步更新裁剪框尺寸（按显示比例转换），并保证不超过图片的实际尺寸
//   if (!cropper.value) return;
//   const imageData = cropper.value.getImageData();
//   boxWidth.value = Math.min(
//     Math.max(50, boxWidth.value || 0),
//     imageData.naturalWidth || 5000
//   );
//   boxHeight.value = Math.min(
//     Math.max(50, boxHeight.value || 0),
//     imageData.naturalHeight || 5000
//   );
//   setCropBoxSize();
// }

// function onSizeChanged() {
//   if (!cropper.value) return;

//   const w = Math.min(
//     Math.max(50, boxWidth.value),
//     cropper.value.getContainerData().width
//   );
//   const h = Math.min(
//     Math.max(50, boxHeight.value),
//     cropper.value.getContainerData().height
//   );

//   cropper.value.setCropBoxData({ width: w, height: h });
// }
function onSizeChanged() {
  if (!cropper.value) return;

  applyingSizeChange.value = true;
  const imageData = cropper.value.getImageData();
  const minSize = 50;
  const maxWidth = imageData.naturalWidth || 5000;
  const maxHeight = imageData.naturalHeight || 5000;
  const w = Math.min(Math.max(minSize, boxWidth.value || 0), maxWidth);
  const h = Math.min(Math.max(minSize, boxHeight.value || 0), maxHeight);

  boxWidth.value = w;
  boxHeight.value = h;

  setCropBoxSize();
  nextTick(() => {
    applyingSizeChange.value = false;
  });
}

</script>

<style scoped>
.batch-crop-container {
  padding: 16px;
}
.page-card {
  border-radius: 12px;
}
.card-header {
  font-size: 18px;
  font-weight: 600;
}
.panel {
  background: var(--el-color-white);
  border-radius: 12px;
  padding: 12px;
}
.upload-area {
  width: 100%;
  margin-bottom: 4px;
}
.upload-area :deep(.el-upload-dragger) {
  padding: 10px 0;
}
.settings-form .size-inline {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.settings-form .size-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.settings-form .size-label {
  color: var(--el-text-color-regular);
  min-width: 48px;
}
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
  justify-content: flex-start;
}
.actions .el-button {
}
.reset-with-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.reset-tip-icon {
  cursor: pointer;
  color: var(--el-text-color-secondary);
}
.settings-form :deep(.el-input-number) {
  width: 160px;
}
.settings-form :deep(.el-input-number__increase),
.settings-form :deep(.el-input-number__decrease) {
  pointer-events: auto;
  z-index: 1;
}
.empty-tip {
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}
.thumbs {
  margin-top: 12px;
}
.thumbs-header {
  font-weight: 600;
  margin-bottom: 8px;
}
.thumbs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.thumb {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  padding: 0;
  background: var(--el-color-white);
  cursor: pointer;
}
.thumb img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
}
.thumb.active {
  outline: 2px solid var(--el-color-primary);
}
.workspace-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.workspace-toolbar .file-name {
  color: var(--el-text-color-regular);
}
.workspace {
  width: 100%;
  min-height: 420px;
  border: 1px dashed var(--el-border-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafafa;
}
.workspace img {
  max-width: 100%;
  max-height: 70vh;
  display: block;
}
.workspace.lock-resize-on :deep(.cropper-line),
.workspace.lock-resize-on :deep(.cropper-point) {
  pointer-events: none;
}
.result-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.grid-item {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  overflow: hidden;
  background: var(--el-color-white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.grid-item .el-image {
  width: 100%;
  height: 160px;
}
.grid-item .name {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.grid-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-top: 1px solid var(--el-border-color);
}
.grid-item .download-btn {
  flex-shrink: 0;
}
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .batch-crop-container {
    padding: 8px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .thumbs-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  .workspace {
    min-height: 320px;
  }
}
</style>
