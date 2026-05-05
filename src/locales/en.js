export default {
  menu: {
    compress: 'Image Compression',
    crop: 'Image Cropping',
    convert: 'Format Conversion',
    rename: 'Batch Rename',
    batchCrop: 'Batch Cropping',
    pdf: 'Images to PDF'
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
      },
      batchCrop: {
        title: 'Batch Crop',
        description: 'Process multiple images in batch with unified crop size'
      },
      pdf: {
        title: 'Images to PDF',
        description: 'Combine multiple images into a single PDF document'
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
    uploadText: 'Drag and drop images here, or',
    clickUpload: 'click to upload',
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
  pdf: {
    title: 'Images to PDF',
    description: 'Merge multiple images into a single PDF file with customizable layout and settings',
    upload: {
      text: 'Drag images here, or click to upload',
      tip: 'Supports jpg/png formats, multiple images can be selected'
    },
    settings: {
      title: 'PDF Settings',
      pageSize: 'Page Size',
      orientation: 'Orientation',
      portrait: 'Portrait',
      landscape: 'Landscape',
      imagesPerPage: 'Images per Page',
      margin: 'Margin',
      quality: 'Image Quality'
    },
    generate: 'Generate PDF',
    preview: 'Live Preview',
    previewDescription: 'Preview PDF page layout, drag to reorder images',
    page: 'Page'
  },
  common: {
    clear: 'Clear'
  },
  batchCrop: {
    title: 'Batch Image Cropping',
    uploadText: 'Drag and drop images here, or',
    clickUpload: 'Click to upload',
    supportedFormats: 'Supports JPG, PNG, GIF, WEBP formats; multiple files supported',
    cropBoxSize: 'Crop Box Size',
    width: 'Width',
    height: 'Height',
    lockResize: 'Lock crop box size',
    lockResizeTip:
      'When enabled, resizing the crop box with the mouse is disabled; use the size inputs on the left instead',
    prev: 'Previous',
    next: 'Next',
    cropCurrent: 'Crop Current',
    cropAll: 'Crop All',
    result: 'Cropped Results Preview',
    downloadAll: 'Download all cropped images as ZIP',
    resetCropBox: 'Reset Crop Box',
    resetCropBoxTip: 'Reset the crop box to the full size of current image',
    imageSizeLabel: 'Size',
    noFiles: 'Please upload images first',
    successMessage: 'Cropped {count} images'
  },
  footer: {
    copyright: '© {year} Image Toolbox - Simple and efficient image processing tool',
    security: 'Data Security: Pure frontend implementation. All processing done locally, images never uploaded to server'
  }
}
