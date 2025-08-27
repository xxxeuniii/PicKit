# 图片工具箱

一个简单高效的图片处理工具，提供多种常用图片处理功能。

## 功能特点

- **图片压缩**：调整图片质量和尺寸，减小文件体积
- **图片裁剪**：自由裁剪图片，支持多种宽高比例
- **格式转换**：在PNG、JPEG和WebP等格式之间转换
- **批量重命名**：上传多张图片，批量重命名并下载

## 技术栈

- **前端框架**：Vue 3
- **UI组件库**：Element Plus
- **图片处理**：
  - Canvas API
  - Pica (高质量图片缩放)
  - Cropper.js (图片裁剪)
  - JSZip (文件打包)

## 使用方法

1. 克隆或下载本项目
2. 直接在浏览器中打开 `index.html` 文件
3. 或者使用任意HTTP服务器托管项目文件

## 本地开发

如果需要进行本地开发，可以使用任意HTTP服务器：

```bash
# 使用Python的HTTP服务器
python -m http.server

# 或使用Node.js的http-server
npx http-server
```

## 项目结构

```
├── index.html      # 主页面
├── css/
│   └── style.css   # 样式文件
├── js/
│   └── app.js      # 应用逻辑
└── README.md       # 项目说明
```

## 浏览器兼容性

支持所有现代浏览器，包括：

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT