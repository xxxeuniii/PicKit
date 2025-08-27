// 创建Vue应用
const { createApp, ref, computed, nextTick, onMounted } = Vue;
const { ElMessage } = ElementPlus;

// 图标组件
const IconComponents = {
    'i-upload-filled': {
        template: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M544 864V672h128L512 480 352 672h128v192H320v-1.6c-5.376.32-10.496 1.6-16 1.6A240 240 0 0 1 64 624c0-123.136 93.12-223.488 212.608-237.248A239.808 239.808 0 0 1 512 192a239.872 239.872 0 0 1 235.456 194.752c119.488 13.76 212.48 114.112 212.48 237.248a240 240 0 0 1-240 240c-5.376 0-10.56-1.28-16-1.6v1.6H544z"></path></svg>`
    },
    'i-refresh-left': {
        template: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"></path></svg>`
    },
    'i-refresh-right': {
        template: `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"></path></svg>`
    }
};

const app = createApp({
    components: IconComponents,
    setup() {
        // 当前活动标签页
        const activeTab = ref('compress');
        
        // 图片压缩相关状态
        const compressImage = ref({
            original: null,
            compressed: null
        });
        const compressQuality = ref(80);
        const compressMaxWidth = ref(1200);
        
        // 图片裁剪相关状态
        const cropImage = ref({
            original: null,
            cropped: null
        });
        const cropAspectRatio = ref('free');
        let cropper = null;
        
        // 图片格式转换相关状态
        const convertImage = ref({
            original: null,
            converted: null
        });
        const convertFormat = ref('png');
        const convertQuality = ref(90);
        
        // 批量重命名相关状态
        const renameFiles = ref([]);
        const renameTemplate = ref('图片_{index}');
        const renameStartIndex = ref(1);
        
        // 计算属性：重命名预览
        const renamePreview = computed(() => {
            return renameFiles.value.map((file, index) => {
                const originalName = file.name;
                const extension = originalName.substring(originalName.lastIndexOf('.'));
                const newName = renameTemplate.value.replace('{index}', (index + renameStartIndex.value).toString().padStart(2, '0')) + extension;
                
                return {
                    original: originalName,
                    new: newName
                };
            });
        });
        
        // 文件大小格式化
        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
        };
        
        // 计算压缩率
        const calculateCompressionRate = () => {
            if (!compressImage.value.original || !compressImage.value.compressed) return 0;
            const originalSize = compressImage.value.original.size;
            const compressedSize = compressImage.value.compressed.size;
            return Math.round((1 - compressedSize / originalSize) * 100);
        };
        
        // 处理压缩图片文件变更
        const handleCompressFileChange = (file) => {
            if (!file || !file.raw) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    compressImage.value = {
                        original: {
                            file: file.raw,
                            url: e.target.result,
                            width: img.width,
                            height: img.height,
                            size: file.raw.size
                        },
                        compressed: null
                    };
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file.raw);
        };
        
        // 压缩图片
        const compressImageAction = async () => {
            if (!compressImage.value.original) {
                ElMessage.warning('请先上传图片');
                return;
            }
            
            try {
                const img = new Image();
                img.src = compressImage.value.original.url;
                
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                
                // 计算新尺寸
                let newWidth = img.width;
                let newHeight = img.height;
                
                if (newWidth > compressMaxWidth.value) {
                    const ratio = compressMaxWidth.value / newWidth;
                    newWidth = compressMaxWidth.value;
                    newHeight = Math.round(newHeight * ratio);
                }
                
                // 创建Canvas
                const canvas = document.createElement('canvas');
                canvas.width = newWidth;
                canvas.height = newHeight;
                const ctx = canvas.getContext('2d');
                
                // 使用pica进行高质量缩放
                const picaInstance = pica();
                await picaInstance.resize(img, canvas);
                
                // 转换为Blob
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, 'image/jpeg', compressQuality.value / 100);
                });
                
                // 更新压缩后的图片信息
                compressImage.value.compressed = {
                    url: URL.createObjectURL(blob),
                    width: newWidth,
                    height: newHeight,
                    size: blob.size
                };
                
                ElMessage.success('图片压缩成功');
            } catch (error) {
                console.error('压缩图片时出错:', error);
                ElMessage.error('压缩图片失败');
            }
        };
        
        // 下载压缩后的图片
        const downloadCompressedImage = () => {
            if (!compressImage.value.compressed) return;
            
            const link = document.createElement('a');
            link.href = compressImage.value.compressed.url;
            link.download = '压缩_' + compressImage.value.original.file.name;
            link.click();
        };
        
        // 处理裁剪图片文件变更
        const handleCropFileChange = async (file) => {
            if (!file || !file.raw) return;
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                cropImage.value = {
                    original: {
                        file: file.raw,
                        url: e.target.result
                    },
                    cropped: null
                };
                
                // 等待DOM更新后初始化裁剪器
                await nextTick();
                initCropper();
            };
            reader.readAsDataURL(file.raw);
        };
        
        // 初始化裁剪器
        const initCropper = () => {
            const image = document.getElementById('cropperImage');
            
            // 如果已存在裁剪器，先销毁
            if (cropper) {
                cropper.destroy();
            }
            
            // 创建新的裁剪器
            cropper = new Cropper(image, {
                viewMode: 1,
                dragMode: 'move',
                aspectRatio: getAspectRatioValue(),
                autoCropArea: 0.8,
                restore: false,
                guides: true,
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false
            });
        };
        
        // 获取裁剪比例值
        const getAspectRatioValue = () => {
            if (cropAspectRatio.value === 'free') return NaN;
            
            const parts = cropAspectRatio.value.split(':');
            return parseInt(parts[0]) / parseInt(parts[1]);
        };
        
        // 更新裁剪器宽高比
        const updateCropperAspectRatio = () => {
            if (cropper) {
                cropper.setAspectRatio(getAspectRatioValue());
            }
        };
        
        // 旋转裁剪器
        const rotateCropper = (degree) => {
            if (cropper) {
                cropper.rotate(degree);
            }
        };
        
        // 裁剪图片
        const cropImageAction = async () => {
            if (!cropper) {
                ElMessage.warning('请先上传图片');
                return;
            }
            
            try {
                // 获取裁剪后的Canvas
                const canvas = cropper.getCroppedCanvas({
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high'
                });
                
                // 转换为Blob
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve);
                });
                
                // 更新裁剪后的图片信息
                cropImage.value.cropped = {
                    url: URL.createObjectURL(blob),
                    width: canvas.width,
                    height: canvas.height
                };
                
                ElMessage.success('图片裁剪成功');
            } catch (error) {
                console.error('裁剪图片时出错:', error);
                ElMessage.error('裁剪图片失败');
            }
        };
        
        // 下载裁剪后的图片
        const downloadCroppedImage = () => {
            if (!cropImage.value.cropped) return;
            
            const link = document.createElement('a');
            link.href = cropImage.value.cropped.url;
            link.download = '裁剪_' + cropImage.value.original.file.name;
            link.click();
        };
        
        // 处理格式转换图片文件变更
        const handleConvertFileChange = (file) => {
            if (!file || !file.raw) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                // 获取原始格式
                const format = file.raw.type.split('/')[1];
                
                convertImage.value = {
                    original: {
                        file: file.raw,
                        url: e.target.result,
                        format: format.toUpperCase(),
                        size: file.raw.size
                    },
                    converted: null
                };
                
                // 设置默认转换格式（不同于原始格式）
                if (format.toLowerCase() === 'png') {
                    convertFormat.value = 'jpeg';
                } else if (format.toLowerCase() === 'jpeg' || format.toLowerCase() === 'jpg') {
                    convertFormat.value = 'png';
                } else {
                    convertFormat.value = 'webp';
                }
            };
            reader.readAsDataURL(file.raw);
        };
        
        // 转换图片格式
        const convertImageFormat = async () => {
            if (!convertImage.value.original) {
                ElMessage.warning('请先上传图片');
                return;
            }
            
            try {
                const img = new Image();
                img.src = convertImage.value.original.url;
                
                await new Promise((resolve) => {
                    img.onload = resolve;
                });
                
                // 创建Canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // 转换为Blob
                let mimeType = 'image/' + convertFormat.value;
                let quality = convertFormat.value === 'png' ? undefined : convertQuality.value / 100;
                
                const blob = await new Promise((resolve) => {
                    canvas.toBlob(resolve, mimeType, quality);
                });
                
                // 更新转换后的图片信息
                convertImage.value.converted = {
                    url: URL.createObjectURL(blob),
                    format: convertFormat.value.toUpperCase(),
                    size: blob.size
                };
                
                ElMessage.success('图片格式转换成功');
            } catch (error) {
                console.error('转换图片格式时出错:', error);
                ElMessage.error('转换图片格式失败');
            }
        };
        
        // 下载转换后的图片
        const downloadConvertedImage = () => {
            if (!convertImage.value.converted) return;
            
            const originalName = convertImage.value.original.file.name;
            const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
            
            const link = document.createElement('a');
            link.href = convertImage.value.converted.url;
            link.download = baseName + '.' + convertFormat.value;
            link.click();
        };
        
        // 处理重命名文件变更
        const handleRenameFileChange = (file, fileList) => {
            renameFiles.value = fileList.map(item => item.raw);
        };
        
        // 下载重命名后的文件
        const downloadRenamedFiles = async () => {
            if (renameFiles.value.length === 0) {
                ElMessage.warning('请先上传文件');
                return;
            }
            
            try {
                // 创建一个JSZip实例
                const JSZip = window.JSZip;
                if (!JSZip) {
                    // 如果JSZip未加载，动态加载
                    await loadJSZip();
                }
                
                const zip = new JSZip();
                
                // 添加文件到zip
                renamePreview.value.forEach((item, index) => {
                    zip.file(item.new, renameFiles.value[index]);
                });
                
                // 生成zip文件
                const content = await zip.generateAsync({type: 'blob'});
                
                // 下载zip文件
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = '重命名图片.zip';
                link.click();
                
                ElMessage.success('文件打包下载成功');
            } catch (error) {
                console.error('打包文件时出错:', error);
                ElMessage.error('打包文件失败');
                
                // 如果是JSZip未加载的错误，提示用户
                if (error.message.includes('JSZip')) {
                    ElMessage.error('请确保已加载JSZip库');
                }
            }
        };
        
        // 动态加载JSZip
        const loadJSZip = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
                script.onload = resolve;
                script.onerror = () => reject(new Error('无法加载JSZip库'));
                document.head.appendChild(script);
            });
        };
        
        // 组件挂载时加载JSZip
        onMounted(() => {
            loadJSZip().catch(error => {
                console.warn('预加载JSZip失败:', error);
            });
        });
        
        return {
            activeTab,
            compressImage,
            compressQuality,
            compressMaxWidth,
            cropImage,
            cropAspectRatio,
            convertImage,
            convertFormat,
            convertQuality,
            renameFiles,
            renameTemplate,
            renameStartIndex,
            renamePreview,
            formatFileSize,
            calculateCompressionRate,
            handleCompressFileChange,
            compressImageAction,
            downloadCompressedImage,
            handleCropFileChange,
            updateCropperAspectRatio,
            rotateCropper,
            cropImageAction,
            downloadCroppedImage,
            handleConvertFileChange,
            convertImageFormat,
            downloadConvertedImage,
            handleRenameFileChange,
            downloadRenamedFiles
        };
    }
});

// 挂载应用
app.use(ElementPlus);
app.mount('#app');