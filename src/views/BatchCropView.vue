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
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div
              class="el-upload__text"
              v-html="$t('batchCrop.uploadText')"
            ></div>
            <div class="el-upload__tip">
              {{ $t("batchCrop.supportedFormats") }}
            </div>
          </el-upload>

          <el-divider />

          <el-form
            label-width="120px"
            label-position="top"
            class="settings-form"
          >
            <el-form-item :label="$t('batchCrop.cropBoxSize')">
              <div class="size-inline">
                <el-input-number
                  size="small"
                  v-model="boxWidth"
                  :min="50"
                  :max="5000"
                  :step="10"
                />
                <span class="x">×</span>
                <el-input-number
                  size="small"
                  v-model="boxHeight"
                  :min="50"
                  :max="5000"
                  :step="10"
                />
              </div>
            </el-form-item>
            <el-form-item :label="$t('batchCrop.lockResize')">
              <el-switch v-model="lockResize" />
            </el-form-item>
          </el-form>

          <div class="actions">
            <el-button
              size="small"
              type="primary"
              :disabled="!hasImages"
              @click="cropCurrent"
              >{{ $t("batchCrop.cropCurrent") }}</el-button
            >

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

      <div style="width: 16px"></div>
      <!-- Right: Workspace & Results -->
      <el-col :xs="24" :sm="24" :md="15" :lg="16">
        <div class="panel">
          <div class="workspace-toolbar">
            <el-button :disabled="!hasImages" @click="prev">{{
              $t("batchCrop.prev")
            }}</el-button>
            <el-button :disabled="!hasImages" @click="next">{{
              $t("batchCrop.next")
            }}</el-button>
            <span class="file-name" v-if="hasImages">{{ currentName }}</span>
          </div>
          <div class="workspace">
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
              <img :src="img.dataUrl" :alt="img.name" />
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
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import JSZip from "jszip";

const images = ref([]); // { name, type, src }
const cropped = ref([]); // { name, dataUrl }
const currentIndex = ref(0);
const workspaceImage = ref(null);
const cropper = ref(null);

const boxWidth = ref(600);
const boxHeight = ref(400);
const lockResize = ref(true);

const hasImages = ref(false);
const currentName = ref("");

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
    cropBoxResizable: !lockResize.value,
    ready() {
      setCropBoxSize();
    },
  });
}

function setCropBoxSize() {
  if (!cropper.value) return;
  // Center crop box with given size
  const containerData = cropper.value.getContainerData();
  const imageData = cropper.value.getImageData();
  const w = Math.min(boxWidth.value, imageData.naturalWidth);
  const h = Math.min(boxHeight.value, imageData.naturalHeight);
  const left = Math.round((containerData.width - w) / 2);
  const top = Math.round((containerData.height - h) / 2);
  cropper.value.setCropBoxData({ left, top, width: w, height: h });
}

watch([boxWidth, boxHeight, lockResize], () => {
  if (!cropper.value) return;
  cropper.value.setCropBoxData({
    width: boxWidth.value,
    height: boxHeight.value,
  });
  cropper.value.setOptions({ cropBoxResizable: !lockResize.value });
});

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
  const canvas = cropper.value.getCroppedCanvas({
    width: boxWidth.value,
    height: boxHeight.value,
  });
  const dataUrl = canvas.toDataURL(mime, 0.92);
  const name = makeCroppedName(images.value[currentIndex.value].name, dataUrl);
  upsertCropped(currentIndex.value, { name, dataUrl });
}

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

function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function clearAll() {
  images.value = [];
  cropped.value = [];
  currentIndex.value = 0;
  hasImages.value = false;
  currentName.value = "";
  destroyCropper();
}
function destroyCropper() {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
}

onBeforeUnmount(destroyCropper);
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
}
.settings-form .size-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.settings-form .size-inline .x {
  color: var(--el-text-color-secondary);
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
.settings-form :deep(.el-input-number) {
  width: 148px;
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
  position: relative;
}
.grid-item img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}
.grid-item .name {
  font-size: 12px;
  padding: 6px 8px;
  border-top: 1px solid var(--el-border-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.grid-item .download-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
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
