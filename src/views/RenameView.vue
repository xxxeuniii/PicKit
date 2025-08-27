<template>
  <div class="rename-container">
    <el-card class="rename-card">
      <template #header>
        <div class="card-header">
          <h2>批量重命名</h2>
        </div>
      </template>
      
      <div class="upload-area">
        <el-upload
          class="upload-box"
          drag
          action=""
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          multiple
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处，或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持批量上传多个图片文件
            </div>
          </template>
        </el-upload>
      </div>
      
      <div v-if="fileList.length > 0" class="rename-workspace">
        <div class="rename-options">
          <h3>重命名选项</h3>
          
          <el-form :model="renameOptions" label-width="100px">
            <el-form-item label="命名模式">
              <el-radio-group v-model="renameOptions.mode">
                <el-radio-button label="prefix">添加前缀</el-radio-button>
                <el-radio-button label="suffix">添加后缀</el-radio-button>
                <el-radio-button label="replace">查找替换</el-radio-button>
                <el-radio-button label="sequence">序列命名</el-radio-button>
              </el-radio-group>
            </el-form-item>
            
            <template v-if="renameOptions.mode === 'prefix'">
              <el-form-item label="前缀文本">
                <el-input v-model="renameOptions.prefix" placeholder="请输入要添加的前缀"></el-input>
              </el-form-item>
            </template>
            
            <template v-if="renameOptions.mode === 'suffix'">
              <el-form-item label="后缀文本">
                <el-input v-model="renameOptions.suffix" placeholder="请输入要添加的后缀"></el-input>
              </el-form-item>
              <el-form-item label="添加位置">
                <el-radio-group v-model="renameOptions.suffixPosition">
                  <el-radio label="beforeExt">扩展名之前</el-radio>
                  <el-radio label="afterExt">扩展名之后</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
            
            <template v-if="renameOptions.mode === 'replace'">
              <el-form-item label="查找文本">
                <el-input v-model="renameOptions.findText" placeholder="请输入要查找的文本"></el-input>
              </el-form-item>
              <el-form-item label="替换为">
                <el-input v-model="renameOptions.replaceText" placeholder="请输入要替换的文本"></el-input>
              </el-form-item>
            </template>
            
            <template v-if="renameOptions.mode === 'sequence'">
              <el-form-item label="基本名称">
                <el-input v-model="renameOptions.baseName" placeholder="请输入基本名称"></el-input>
              </el-form-item>
              <el-form-item label="起始编号">
                <el-input-number v-model="renameOptions.startNumber" :min="0" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="数字位数">
                <el-input-number v-model="renameOptions.digitCount" :min="1" :max="10" :step="1"></el-input-number>
              </el-form-item>
            </template>
            
            <el-form-item>
              <el-button type="primary" @click="applyRename">应用重命名</el-button>
              <el-button @click="resetOptions">重置选项</el-button>
            </el-form-item>
          </el-form>
        </div>
        
        <div class="file-list">
          <h3>文件列表 ({{ fileList.length }}个文件)</h3>
          <el-table :data="fileList" style="width: 100%">
            <el-table-column label="原始文件名" prop="originalName" min-width="180"></el-table-column>
            <el-table-column label="预览新文件名" min-width="180">
              <template #default="scope">
                <span>{{ getPreviewName(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button type="danger" size="small" @click="removeFile(scope.$index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="download-section" v-if="renamedFiles.length > 0">
          <el-divider>重命名完成</el-divider>
          <el-button type="success" @click="downloadAllFiles">
            <el-icon><Download /></el-icon> 下载所有重命名后的文件
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { UploadFilled, Delete, Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import JSZip from 'jszip';

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

const handleFileChange = (file, fileList) => {
  // 只处理图片文件
  if (!file.raw.type.startsWith('image/')) {
    ElMessage.warning('请上传图片文件');
    return;
  }
  
  // 更新文件列表
  updateFileList(fileList);
};

const handleFileRemove = (file, fileList) => {
  updateFileList(fileList);
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
    ElMessage.warning('请先上传文件');
    return;
  }
  
  // 检查重命名选项
  if (renameOptions.mode === 'prefix' && !renameOptions.prefix) {
    ElMessage.warning('请输入前缀文本');
    return;
  }
  
  if (renameOptions.mode === 'suffix' && !renameOptions.suffix) {
    ElMessage.warning('请输入后缀文本');
    return;
  }
  
  if (renameOptions.mode === 'replace' && !renameOptions.findText) {
    ElMessage.warning('请输入查找文本');
    return;
  }
  
  if (renameOptions.mode === 'sequence' && !renameOptions.baseName) {
    ElMessage.warning('请输入基本名称');
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
    ElMessage.success(`已成功重命名 ${results.length} 个文件`);
  });
};

const downloadAllFiles = () => {
  if (renamedFiles.value.length === 0) {
    ElMessage.warning('没有可下载的文件');
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
.rename-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.rename-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
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
  
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>