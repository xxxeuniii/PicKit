# 图片工具箱

一个简单高效的图片处理工具，提供多种常用图片处理功能。在线使用，无需下载安装，快速处理您的图片需求。

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
├── src/            # 源代码目录
│   ├── App.vue     # 主应用组件
│   ├── main.js     # 入口文件
│   ├── router/     # 路由配置
│   └── views/      # 视图组件
├── public/         # 静态资源
│   └── robots.txt  # 搜索引擎爬虫规则
└── README.md       # 项目说明
```

## SEO优化指南

为了提高网站在搜索引擎中的自然收录，已完成以下优化：

1. **添加元信息**
   - 添加了meta description、keywords和robots标签
   - 设置了canonical链接

2. **生成Sitemap**
   - 使用vite-plugin-sitemap自动生成sitemap.xml
   - 配置了网站的所有重要页面

3. **创建robots.txt**
   - 允许搜索引擎爬取所有内容
   - 指向sitemap.xml位置

## 提交到搜索引擎

网站部署后，请完成以下步骤：

1. **Google Search Console**
   - 注册并验证网站所有权
   - 提交sitemap.xml文件
   - 网址：https://search.google.com/search-console

2. **Bing Webmaster Tools**
   - 注册并验证网站
   - 提交sitemap.xml文件
   - 网址：https://www.bing.com/webmasters

3. **获取外部链接**
   - 在社交平台发布网站信息
   - 推荐平台：Twitter、Reddit、相关论坛

## 浏览器兼容性

支持所有现代浏览器，包括：

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT