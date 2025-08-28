export default {
  menu: {
    compress: 'Image Compression',
    crop: 'Image Cropping',
    convert: 'Format Conversion',
    rename: 'Batch Rename'
  },
  home: {
    welcome: 'Welcome to Image Toolbox',
    title: 'Image Toolbox',
    subtitle: 'Simple and efficient image processing tool',
    features: {
      compress: {
        title: 'Image Compression',
        description: 'Adjust image quality and size to reduce file size'
      },
      crop: {
        title: 'Image Cropping',
        description: 'Freely crop images with multiple aspect ratios'
      },
      convert: {
        title: 'Format Conversion',
        description: 'Convert between PNG, JPEG, WebP and other formats'
      },
      rename: {
        title: 'Batch Rename',
        description: 'Upload multiple images, rename them in batch and download'
      }
    }
  },
  compress: {
    uploadText: 'Drag image here',
    clickUpload: 'or click to upload',
    supportedFormats: 'Supports common image formats like JPG, PNG, GIF, WEBP',
    originalImage: 'Original Image',
    dimensions: 'Dimensions',
    size: 'Size',
    compressionSettings: 'Compression Settings',
    quality: 'Quality',
    lowQuality: 'Low Quality',
    highQuality: 'High Quality',
    maxWidth: 'Max Width',
    compressButton: 'Compress Image',
    compressed: 'Compressed',
    compressionRate: 'Compression Rate',
    downloadButton: 'Download Image',
    downloadPrefix: 'compressed_',
    uploadWarning: 'Please upload an image first',
    successMessage: 'Image compressed successfully',
    errorMessage: 'Failed to compress image'
  },
  crop: {
    uploadText: 'Drag image here',
    clickUpload: 'or click to upload',
    supportedFormats: 'Supports common image formats like JPG, PNG, GIF',
    aspectRatio: 'Aspect Ratio',
    aspectRatios: {
      free: 'Free'
    },
    rotation: 'Rotation',
    rotateLeft: 'Rotate Left',
    rotateRight: 'Rotate Right',
    flip: 'Flip',
    flipHorizontal: 'Flip Horizontal',
    flipVertical: 'Flip Vertical',
    reset: 'Reset',
    cropButton: 'Crop',
    result: 'Crop Result',
    croppedImage: 'Cropped Image',
    downloadButton: 'Download Cropped Image',
    clearAndRestart: 'Clear and Restart'
  },
  convert: {
    uploadText: 'Drag and drop an image here, or',
    clickUpload: 'Click to upload',
    supportedFormats: 'Supports common image formats like JPG, PNG, GIF, WEBP',
    originalImage: 'Original Image',
    fileName: 'File Name',
    originalFormat: 'Original Format',
    dimensions: 'Image Dimensions',
    pixels: 'Pixels',
    targetFormat: 'Target Format',
    quality: 'Quality',
    clear: 'Clear',
    convertButton: 'Convert',
    result: 'Conversion Result',
    convertedImage: 'Converted Image',
    downloadButton: 'Download Converted Image',
    convertAnother: 'Convert Another Image',
    unknownFormat: 'Unknown Format',
    successMessage: 'Image format conversion successful!',
    errorMessage: 'Image format conversion failed, please try another format.'
  },
    rename: {
    title: 'Batch Rename',
    uploadText: 'Drag and drop images here, or <em>click to upload</em>',
    uploadTip: 'Supports uploading multiple image files',
    renameOptions: 'Rename Options',
    modeLabel: 'Naming Mode',
    prefix: 'Add Prefix',
    suffix: 'Add Suffix',
    replace: 'Find & Replace',
    sequence: 'Sequence Naming',
    prefixText: 'Prefix Text',
    suffixText: 'Suffix Text',
    suffixPosition: 'Suffix Position',
    beforeExt: 'Before Extension',
    afterExt: 'After Extension',
    findText: 'Find Text',
    replaceText: 'Replace With',
    baseName: 'Base Name',
    startNumber: 'Start Number',
    digitCount: 'Digit Count',
    applyButton: 'Apply Rename',
    resetButton: 'Reset Options',
    fileListTitle: 'File List',
    originalName: 'Original Name',
    previewName: 'Preview Name',
    action: 'Action',
    downloadAll: 'Download All Renamed Files',
    renameSuccess: 'Successfully renamed {count} files',
    noFiles: 'Please upload files first',
    emptyPrefix: 'Please enter prefix text',
    emptySuffix: 'Please enter suffix text',
    emptyFindText: 'Please enter find text',
    emptyBaseName: 'Please enter base name',
  },
  footer: {
    copyright: '© {year} Image Toolbox - Simple and efficient image processing tool'
  }
}
