export default {
  menu: {
    compress: '画像圧縮',
    crop: '画像トリミング',
    convert: 'フォーマット変換',
    rename: '一括リネーム',
    pdf: '画像をPDFに'
  },
  home: {
    welcome: '画像ツールボックスへようこそ',
    title: '画像ツールボックス',
    subtitle: 'シンプルで効率的な画像処理ツール',
    features: {
      compress: {
        title: '画像圧縮',
        description: '画像の品質とサイズを調整してファイルサイズを縮小'
      },
      crop: {
        title: '画像トリミング',
        description: '自由に画像をトリミングし、複数のアスペクト比をサポート'
      },
      convert: {
        title: 'フォーマット変換',
        description: 'PNG、JPEG、WebPなどのフォーマット間で変換'
      },
      rename: {
        title: '一括リネーム',
        description: '複数の画像をアップロードし、一括でリネームしてダウンロード'
      },
      pdf: {
        title: '画像をPDFに',
        description: '複数の画像を結合してPDF文書を作成'
      }
    }
  },
  compress: {
    uploadText: '画像をここにドラッグ',
    clickUpload: 'またはクリックしてアップロード',
    supportedFormats: 'JPG、PNG、GIF、WEBPなどの一般的な画像形式をサポート',
    originalImage: '元の画像',
    dimensions: 'サイズ',
    size: 'ファイルサイズ',
    compressionSettings: '圧縮設定',
    quality: '品質',
    lowQuality: '低品質',
    highQuality: '高品質',
    maxWidth: '最大幅',
    compressButton: '画像を圧縮',
    compressed: '圧縮後',
    compressionRate: '圧縮率',
    downloadButton: '画像をダウンロード',
    downloadPrefix: '圧縮_',
    uploadWarning: 'まず画像をアップロードしてください',
    successMessage: '画像の圧縮に成功しました',
    errorMessage: '画像の圧縮に失敗しました'
  },
  crop: {
    uploadText: '画像をここにドラッグ',
    clickUpload: 'またはクリックしてアップロード',
    supportedFormats: 'JPG、PNG、GIFなどの一般的な画像形式をサポート',
    aspectRatio: 'アスペクト比',
    aspectRatios: {
      free: 'フリー'
    },
    rotation: '回転',
    rotateLeft: '左に回転',
    rotateRight: '右に回転',
    flip: '反転',
    flipHorizontal: '水平反転',
    flipVertical: '垂直反転',
    reset: 'リセット',
    cropButton: 'トリミング',
    result: 'トリミング結果',
    croppedImage: 'トリミング後の画像',
    downloadButton: 'トリミング後の画像をダウンロード',
    clearAndRestart: 'クリアして再開'
  },
  convert: {
    uploadText: '画像をここにドロップ、または',
    clickUpload: 'クリックしてアップロード',
    supportedFormats: 'JPG、PNG、GIF、WEBPなどの一般的な画像形式に対応',
    originalImage: '元の画像',
    fileName: 'ファイル名',
    originalFormat: '元の形式',
    dimensions: '画像サイズ',
    pixels: 'ピクセル',
    targetFormat: '変換後の形式',
    quality: '品質',
    clear: 'クリア',
    convertButton: '変換',
    result: '変換結果',
    convertedImage: '変換後の画像',
    downloadButton: '変換後の画像をダウンロード',
    convertAnother: '別の画像を変換',
    unknownFormat: '不明な形式',
    successMessage: '画像形式の変換に成功しました！',
    errorMessage: '画像形式の変換に失敗しました。別の形式をお試しください。'
  },
  rename: {
    title: '一括リネーム',
    uploadText: '画像をここにドラッグ、または <em>クリックしてアップロード</em>',
    uploadTip: '複数の画像ファイルをアップロード可能',
    renameOptions: 'リネームオプション',
    modeLabel: '命名モード',
    prefix: 'プレフィックス追加',
    suffix: 'サフィックス追加',
    replace: '検索と置換',
    sequence: '連番命名',
    prefixText: 'プレフィックステキスト',
    suffixText: 'サフィックステキスト',
    suffixPosition: '追加位置',
    beforeExt: '拡張子の前',
    afterExt: '拡張子の後',
    findText: '検索テキスト',
    replaceText: '置換テキスト',
    baseName: '基本名',
    startNumber: '開始番号',
    digitCount: '桁数',
    applyButton: 'リネームを適用',
    resetButton: 'オプションをリセット',
    fileListTitle: 'ファイルリスト',
    originalName: '元のファイル名',
    previewName: 'プレビュー名',
    action: '操作',
    downloadAll: 'リネーム後のファイルをすべてダウンロード',
    renameSuccess: '{count}個のファイルのリネームに成功しました',
    noFiles: 'ファイルをアップロードしてください',
    emptyPrefix: 'プレフィックステキストを入力してください',
    emptySuffix: 'サフィックステキストを入力してください',
    emptyFindText: '検索テキストを入力してください',
    emptyBaseName: '基本名を入力してください'
  },
  pdf: {
    title: '画像をPDFに',
    description: '複数の画像を結合してPDF文書を作成',
    upload: {
      text: '画像をここにドラッグ、またはクリックしてアップロード',
      tip: 'JPG、PNG、GIFなどの形式に対応、複数の画像を一括アップロード可能'
    },
    settings: {
      title: 'PDF設定',
      pageSize: 'ページサイズ',
      orientation: 'ページの向き',
      portrait: '縦向き',
      landscape: '横向き',
      imagesPerPage: 'ページあたりの画像数',
      margin: 'ページ余白',
      quality: '画像品質'
    },
    generate: 'PDF生成',
    preview: '画像プレビュー',
    clear: 'すべてクリア'
  },
  common: {
    clear: 'クリア'
  },
  footer: {
    copyright: '© {year} 画像ツールボックス - シンプルで効率的な画像処理ツール'
  }
}