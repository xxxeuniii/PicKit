<template>
  <!-- 批量重命名 -->
  <div class="rename-container">
    <div class="upload-area">
      <el-upload class="upload-box" drag action="" :auto-upload="false" :on-change="handleFileChange"
        :on-remove="handleFileRemove" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text" v-html="$t('rename.uploadText')"></div>
        <div class="upload-tip">
          {{ $t('rename.uploadTip') }}
        </div>
      </el-upload>
    </div>

    <div v-if="fileList.length > 0" class="rename-workspace">
      <div class="rename-options">
        <h3>{{ $t('rename.renameOptions') }}</h3>

        <el-form :model="renameOptions" label-width="100px">
          <el-form-item :label="$t('rename.modeLabel')">
            <el-radio-group v-model="renameOptions.mode">
              <el-radio-button label="prefix">{{ $t('rename.prefix') }}</el-radio-button>
              <el-radio-button label="suffix">{{ $t('rename.suffix') }}</el-radio-button>
              <el-radio-button label="replace">{{ $t('rename.replace') }}</el-radio-button>
              <el-radio-button label="sequence">{{ $t('rename.sequence') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <template v-if="renameOptions.mode === 'prefix'">
            <el-form-item :label="$t('rename.prefixText')">
              <el-input v-model="renameOptions.prefix" :placeholder="$t('rename.emptyPrefix')"></el-input>
            </el-form-item>
          </template>

          <template v-if="renameOptions.mode === 'suffix'">
            <el-form-item :label="$t('rename.suffixText')">
              <el-input v-model="renameOptions.suffix" :placeholder="$t('rename.emptySuffix')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('rename.suffixPosition')">
              <el-radio-group v-model="renameOptions.suffixPosition">
                <el-radio label="beforeExt">{{ $t('rename.beforeExt') }}</el-radio>
                <el-radio label="afterExt">{{ $t('rename.afterExt') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>

          <template v-if="renameOptions.mode === 'replace'">
            <el-form-item :label="$t('rename.findText')">
              <el-input v-model="renameOptions.findText" :placeholder="$t('rename.emptyFindText')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('rename.replaceText')">
              <el-input v-model="renameOptions.replaceText" :placeholder="$t('rename.replaceText')"></el-input>
            </el-form-item>
          </template>

          <template v-if="renameOptions.mode === 'sequence'">
            <el-form-item :label="$t('rename.baseName')">
              <el-input v-model="renameOptions.baseName" :placeholder="$t('rename.emptyBaseName')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('rename.startNumber')">
              <el-input-number v-model="renameOptions.startNumber" :min="0" :step="1"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('rename.digitCount')">
              <el-input-number v-model="renameOptions.digitCount" :min="1" :max="10" :step="1"></el-input-number>
            </el-form-item>
          </template>

          <el-form-item>
            <el-button type="primary" @click="applyRename">{{ $t('rename.applyButton') }}</el-button>
            <el-button @click="resetOptions">{{ $t('rename.resetButton') }}</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="file-list">
        <h3>{{ $t('rename.fileListTitle') }} ({{ fileList.length }})</h3>
        <el-table :data="fileList" style="width: 100%">
          <el-table-column :label="$t('rename.originalName')" prop="originalName" min-width="180"></el-table-column>
          <el-table-column :label="$t('rename.previewName')" min-width="180">
            <template #default="scope">
              <span>{{ getPreviewName(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('rename.action')" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="removeFile(scope.$index)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="download-section" v-if="renamedFiles.length > 0">
        <el-divider>{{ $t('rename.title') }}</el-divider>
        <el-button type="success" @click="downloadAllFiles">
          <el-icon>
            <Download />
          </el-icon> {{ $t('rename.downloadAll') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { UploadFilled, Delete, Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import JSZip from 'jszip';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const fileList = ref([]);
const renamedFiles = ref([]);

const renameOptions = reactive({
  mode: 'prefix',
  prefix: '',
  suffix: '',
  suffixPosition: 'beforeExt',
  findText: '',
  replaceText: '',
  baseName: 'IMG',
  startNumber: 1,
  digitCount: 3
});

const handleFileChange = (file, fileListParam) => {
  // 只处理图片文件
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.warning(t('rename.noFiles'));
    return;
  }

  // 更新文件列表
  updateFileList(fileListParam);
};

const handleFileRemove = (file, fileListParam) => {
  updateFileList(fileListParam);
};

const updateFileList = (uploadFileList) => {
  fileList.value = uploadFileList.map(file => {
    const nameParts = file.name.split('.');
    const extension = nameParts.pop();
    const nameWithoutExt = nameParts.join('.');

    return {
      uid: file.uid,
      file: file.raw,
      originalName: file.name,
      nameWithoutExt: nameWithoutExt,
      extension: extension
    };
  });
};

const removeFile = (index) => {
  fileList.value.splice(index, 1);
};

const getPreviewName = (file) => {
  let newName = '';

  switch (renameOptions.mode) {
    case 'prefix':
      newName = `${renameOptions.prefix}${file.originalName}`;
      break;

    case 'suffix':
      if (renameOptions.suffixPosition === 'beforeExt') {
        newName = `${file.nameWithoutExt}${renameOptions.suffix}.${file.extension}`;
      } else {
        newName = `${file.nameWithoutExt}.${file.extension}${renameOptions.suffix}`;
      }
      break;

    case 'replace':
      if (renameOptions.findText) {
        newName = file.originalName.replace(new RegExp(renameOptions.findText, 'g'), renameOptions.replaceText);
      } else {
        newName = file.originalName;
      }
      break;

    case 'sequence':
      const index = fileList.value.findIndex(f => f.uid === file.uid);
      const number = (renameOptions.startNumber + index).toString().padStart(renameOptions.digitCount, '0');
      newName = `${renameOptions.baseName}${number}.${file.extension}`;
      break;

    default:
      newName = file.originalName;
  }

  return newName;
};

const applyRename = () => {
  if (fileList.value.length === 0) {
    ElMessage.warning(t('rename.noFiles'));
    return;
  }

  // 检查重命名选项
  if (renameOptions.mode === 'prefix' && !renameOptions.prefix) {
    ElMessage.warning(t('rename.emptyPrefix'));
    return;
  }

  if (renameOptions.mode === 'suffix' && !renameOptions.suffix) {
    ElMessage.warning(t('rename.emptySuffix'));
    return;
  }

  if (renameOptions.mode === 'replace' && !renameOptions.findText) {
    ElMessage.warning(t('rename.emptyFindText'));
    return;
  }

  if (renameOptions.mode === 'sequence' && !renameOptions.baseName) {
    ElMessage.warning(t('rename.emptyBaseName'));
    return;
  }

  // 处理每个文件
  const promises = fileList.value.map(file => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newName = getPreviewName(file);
        resolve({
          name: newName,
          content: e.target.result
        });
      };
      reader.readAsDataURL(file.file);
    });
  });

  Promise.all(promises).then(results => {
    renamedFiles.value = results;
    ElMessage.success(t('rename.renameSuccess', { count: results.length }));
  });
};

const downloadAllFiles = () => {
  if (renamedFiles.value.length === 0) {
    ElMessage.warning(t('rename.noFiles'));
    return;
  }

  if (renamedFiles.value.length === 1) {
    // 如果只有一个文件，直接下载
    const file = renamedFiles.value[0];
    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // 多个文件打包下载
    const zip = new JSZip();

    renamedFiles.value.forEach(file => {
      // 从 data URL 中提取 base64 内容
      const base64Data = file.content.split(',')[1];
      zip.file(file.name, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'renamed_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
};

const resetOptions = () => {
  Object.assign(renameOptions, {
    mode: 'prefix',
    prefix: '',
    suffix: '',
    suffixPosition: 'beforeExt',
    findText: '',
    replaceText: '',
    baseName: 'IMG',
    startNumber: 1,
    digitCount: 3
  });
};
</script>

<style scoped>
.card-header h2 {
  color: #409eff;
}

.rename-container {
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

.rename-workspace {
  margin-top: 20px;
}

.rename-options {
  margin-bottom: 20px;
}

.file-list {
  margin-top: 30px;
}

.download-section {
  margin-top: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .rename-container {
    padding: 10px;
  }

  .upload-box {
    max-width: 100%;
  }

  .rename-workspace {
    margin-top: 12px;
  }

  .rename-options h3,
  .file-list h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .el-form-item {
    margin-bottom: 14px;
  }
}
</style>
