# 3D客厅展示

中文 | [English](README_EN.md)

一个基于Three.js的3D客厅交互式展示应用，允许用户浏览和交互3D客厅场景中的物体。

## 功能特点

- 3D客厅场景的实时渲染和交互
- 支持鼠标拖动旋转视角、滚轮缩放和右键平移
- 点击物体可查看详细信息
- 特定物体（如灯具）支持交互功能
- 响应式设计，适应不同屏幕尺寸
- 优雅的加载界面和错误处理

## 技术栈

- [Three.js](https://threejs.org/) - 3D图形库
- [Vite](https://vitejs.dev/) - 前端构建工具
- 原生JavaScript
- CSS3

## 安装与运行

### 前提条件

- Node.js (推荐v14.0.0或更高版本)
- npm或yarn包管理器

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/zym9863/3d-living-room.git
cd 3d-living-room
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

4. 打开浏览器访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建后的文件将位于 `dist` 目录中。

## 使用指南

- **旋转视角**: 点击并拖动鼠标
- **缩放**: 使用鼠标滚轮
- **平移**: 按住鼠标右键并拖动
- **查看物体信息**: 点击场景中的物体
- **交互**: 点击灯具可以切换灯光

## 项目结构

```
3d-living-room/
├── dist/               # 构建输出目录
├── src/                # 源代码
│   └── main.js         # 主要JavaScript代码
├── public/             # 静态资源
├── index.html          # HTML入口文件
├── style.css           # 全局样式
├── scene.glb           # 3D模型文件
├── vite.config.js      # Vite配置
├── package.json        # 项目依赖和脚本
└── README.md           # 项目文档
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 致谢

- [Three.js](https://threejs.org/) 提供的强大3D渲染能力
- [Vite](https://vitejs.dev/) 提供的高效开发体验