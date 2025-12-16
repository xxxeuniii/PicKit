export default {
  menu: {
    compress: '图片压缩',
    crop: '图片裁剪',
    convert: '格式转换',
    rename: '批量重命名',
    pdf: '图片转PDF',
    batchCrop: '批量裁剪'
  },
  home: {
    welcome: '欢迎使用图片工具箱',
    title: '图片工具箱',
    subtitle: '简单高效的图片处理工具',
    features: {
      compress: {
        title: '图片压缩',
        description: '调整图片质量和尺寸，减小文件体积'
      },
      crop: {
        title: '图片裁剪',
        description: '自由裁剪图片，支持多种宽高比例'
      },
      convert: {
        title: '格式转换',
        description: '在PNG、JPEG和WebP等格式之间转换'
      },
      rename: {
        title: '批量重命名',
        description: '上传多张图片，批量重命名并下载'
      },
      pdf: {
        title: '图片转PDF',
        description: '将多张图片拼接合并生成PDF文档'
      }
    }
  },
  compress: {
    uploadText: '拖拽图片到此处',
    clickUpload: '点击上传',
    supportedFormats: '支持JPG、PNG、GIF、WEBP等常见图片格式',
    originalImage: '原始图片',
    dimensions: '尺寸',
    size: '大小',
    compressionSettings: '压缩设置',
    quality: '质量',
    lowQuality: '低质量',
    highQuality: '高质量',
    maxWidth: '最大宽度',
    compressButton: '压缩图片',
    compressed: '压缩后',
    compressionRate: '压缩率',
    downloadButton: '下载图片',
    downloadPrefix: '压缩_',
    uploadWarning: '请先上传图片',
    successMessage: '图片压缩成功',
    errorMessage: '压缩图片失败'
  },
  crop: {
    uploadText: '拖拽图片到此处',
    clickUpload: '点击上传',
    supportedFormats: '支持JPG、PNG、GIF等常见图片格式',
    aspectRatio: '宽高比例',
    aspectRatios: {
      free: '自由'
    },
    rotation: '旋转',
    rotateLeft: '向左旋转',
    rotateRight: '向右旋转',
    flip: '翻转',
    flipHorizontal: '水平翻转',
    flipVertical: '垂直翻转',
    reset: '重置',
    cropButton: '裁剪',
    result: '裁剪结果',
    croppedImage: '裁剪后的图片',
    downloadButton: '下载裁剪后的图片',
    clearAndRestart: '清除并重新开始'
  },
  convert: {
    uploadText: '拖拽图片到此处，或',
    clickUpload: '点击上传',
    supportedFormats: '支持JPG、PNG、GIF、WEBP等常见图片格式',
    originalImage: '原始图片',
    fileName: '文件名',
    originalFormat: '原始格式',
    dimensions: '图片尺寸',
    pixels: '像素',
    targetFormat: '目标格式',
    quality: '质量',
    clear: '清除',
    convertButton: '转换',
    result: '转换结果',
    convertedImage: '转换后的图片',
    downloadButton: '下载转换后的图片',
    convertAnother: '转换另一张图片',
    unknownFormat: '未知格式',
    successMessage: '图片格式转换成功！',
    errorMessage: '图片格式转换失败，请尝试其他格式。'
  },
    rename: {
    title: '批量重命名',
    uploadText: '拖拽图片到此处，或 <em>点击上传</em>',
    uploadTip: '支持批量上传多个图片文件',
    renameOptions: '重命名选项',
    modeLabel: '命名模式',
    prefix: '添加前缀',
    suffix: '添加后缀',
    replace: '查找替换',
    sequence: '序列命名',
    prefixText: '前缀文本',
    suffixText: '后缀文本',
    suffixPosition: '添加位置',
    beforeExt: '扩展名之前',
    afterExt: '扩展名之后',
    findText: '查找文本',
    replaceText: '替换为',
    baseName: '基本名称',
    startNumber: '起始编号',
    digitCount: '数字位数',
    applyButton: '应用重命名',
    resetButton: '重置选项',
    fileListTitle: '文件列表',
    originalName: '原始文件名',
    previewName: '预览新文件名',
    action: '操作',
    downloadAll: '下载所有重命名后的文件',
    renameSuccess: '已成功重命名 {count} 个文件',
    noFiles: '请先上传文件',
    emptyPrefix: '请输入前缀文本',
    emptySuffix: '请输入后缀文本',
    emptyFindText: '请输入查找文本',
    emptyBaseName: '请输入基本名称',
  },
  pdf: {
    title: '图片转PDF',
    description: '将多张图片合并成一个PDF文件，支持自定义布局和设置',
    upload: {
      text: '将图片拖到此处，或点击上传',
      tip: '支持jpg/png格式，可同时选择多张图片'
    },
    settings: {
      title: 'PDF设置',
      pageSize: '页面大小',
      orientation: '页面方向',
      portrait: '纵向',
      landscape: '横向',
      imagesPerPage: '每页图片数',
      margin: '页边距',
      quality: '图片质量'
    },
    generate: '生成PDF',
    preview: '实时预览',
    previewDescription: '预览PDF页面布局效果，可拖拽调整图片顺序',
    page: '第',
    clear: '清除所有'
  },
  common: {
    clear: '清除'
  },
  batchCrop: {
    title: '图片批量裁剪',
    uploadText: '拖拽图片到此处，或',
    clickUpload: '点击上传',
    supportedFormats: '支持JPG、PNG、GIF、WEBP等图片格式，支持多文件',
    cropBoxSize: '裁剪框尺寸',
    width: '宽度',
    height: '高度',
    lockResize: '锁定裁剪框尺寸',
    lockResizeTip: '开启后会禁用用鼠标拉伸裁剪框，只能通过左侧输入框修改宽高',
    prev: '上一张',
    next: '下一张',
    cropCurrent: '裁剪当前',
    cropAll: '裁剪全部',
    result: '裁剪结果预览',
    downloadAll: '打包下载所有裁剪后的图片',
    resetCropBox: '恢复裁剪框',
    resetCropBoxTip: '将裁剪框恢复为当前图片的完整尺寸',
    imageSizeLabel: '尺寸',
    noFiles: '请先上传图片',
    successMessage: '已裁剪 {count} 张图片',
    fitView: '恢复画布'
  },
  footer: {
    copyright: '© {year} 图片工具箱 - 简单高效的图片处理工具'
  }
}
