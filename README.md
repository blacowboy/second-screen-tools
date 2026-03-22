# 翻页时钟

一个精美的跨平台桌面翻页时钟应用，带有翻页动画效果，精确到秒，并支持多种内容显示（诗词、毒鸡汤、舔狗日记）。

## 功能特点

- **翻页动画效果**：数字变化时带有逼真的翻页动画
- **精确到秒**：实时显示时:分:秒
- **多种内容类型**：
  - 诗词 (sc)：显示古诗词
  - 毒鸡汤 (djt)：显示毒鸡汤内容
  - 舔狗日记 (tgrj)：显示舔狗日记
- **时间源选择**：
  - 系统时间
  - NTP 同步
  - 自定义时间
- **可配置刷新频率**：15分钟、30分钟、1小时、12小时（默认）、24小时
- **深色主题**：优雅的深色渐变背景
- **响应式设计**：适配不同屏幕尺寸
- **跨平台**：支持 Windows、Linux、macOS

## 文件结构

```
second_screen_tools/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript 逻辑
├── main.js             # Electron 主进程
├── preload.js          # Electron 预加载脚本
├── config.html         # 配置窗口页面
├── package.json        # 项目配置
├── install.sh          # Linux 一键安装脚本
├── start.bat           # Windows 启动脚本 ⭐
├── build-windows.bat   # Windows 构建脚本 ⭐
├── start.sh            # Linux/macOS 启动脚本
├── create_icon.py      # 图标生成脚本（Python）
├── create-icons.js     # 图标生成脚本（Node.js）⭐
├── assets/
│   ├── icon.svg        # 应用图标源文件
│   ├── icon.png        # Linux 图标（256x256）
│   ├── icon.ico        # Windows 图标 ⭐
│   └── icon.icns       # macOS 图标
└── README.md           # 说明文档
```

## 快速开始

### Windows

#### 方式一：直接运行（最简单）

1. **安装 Node.js 18+**
   - 访问 https://nodejs.org/
   - 下载并安装 LTS 版本

2. **运行应用**
   ```cmd
   # 双击运行
   start.bat
   
   # 或在命令行中运行
   cd second_screen_tools
   start.bat
   ```

#### 方式二：构建独立应用

```cmd
# 1. 安装依赖
npm install

# 2. 运行构建脚本（交互式）
build-windows.bat

# 或手动构建
npm run build:win          # 构建安装包
npm run build:win:portable # 构建便携版
```

构建完成后在 `dist/` 目录：
- `flip-clock-setup-1.0.0-x64.exe` - 安装程序（推荐）
- `flip-clock-portable-1.0.0-x64.exe` - 便携版（无需安装）

### Linux

#### 方式一：一键安装（最简单）

```bash
cd second_screen_tools
chmod +x install.sh
./install.sh
```

安装完成后：
- 直接运行：`./flip-clock.sh`
- 或双击桌面上的 `flip-clock.desktop` 图标

#### 方式二：手动安装

```bash
# 1. 安装 Node.js 18+ (如果还没有安装)
# Ubuntu/Debian:
sudo apt update
sudo apt install nodejs npm

# 或者使用 nvm 安装最新版 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 2. 安装项目依赖
npm install

# 3. 运行应用
npm start

# 4. 或构建生产版本
npm run build:linux:appimage  # 生成 AppImage
npm run build:linux:deb       # 生成 deb 安装包
```

### macOS

```bash
# 1. 安装 Node.js 18+
# 使用 Homebrew:
brew install node

# 或使用 nvm
nvm install 18
nvm use 18

# 2. 安装依赖
npm install

# 3. 运行
npm start

# 4. 构建
npm run build:mac  # 生成 DMG 安装包
```

## 使用说明

### 启动应用

```bash
# 开发模式
npm start

# Windows
start.bat

# Linux/macOS
./start.sh
```

### 打开配置

在应用窗口内**右键点击**，选择「配置」打开配置窗口。

### 配置选项

#### 时间设置
- **系统时间**：使用电脑本地时间（默认）
- **NTP 同步**：使用网络时间协议同步时间
- **自定义时间**：手动设置显示的时间

#### 内容设置
- **诗词 (sc)**：显示古诗词
- **毒鸡汤 (djt)**：显示毒鸡汤内容
- **舔狗日记 (tgrj)**：显示舔狗日记

#### 刷新设置
- 15分钟
- 30分钟
- 1小时
- **12小时**（默认，半天）
- 24小时

### 构建安装包

#### Windows

```bash
# 构建安装程序（推荐）
npm run build:win

# 构建便携版（无需安装，双击即用）
npm run build:win:portable

# 构建 ZIP 压缩包
electron-builder --win zip
```

输出文件：
- `dist/flip-clock-setup-1.0.0-x64.exe` - 安装程序
- `dist/flip-clock-portable-1.0.0-x64.exe` - 便携版

#### Linux

```bash
# 构建 AppImage（推荐，无需安装，双击即用）
npm run build:linux:appimage

# 构建 deb 安装包（Ubuntu/Debian）
npm run build:linux:deb

# 构建 snap 包
npm run build:linux:snap

# 构建 rpm 包（CentOS/RHEL/Fedora）
npm run build:linux:rpm
```

输出文件：
- `dist/flip-clock-1.0.0-x86_64.AppImage` - AppImage 格式
- `dist/flip-clock-1.0.0-amd64.deb` - Debian/Ubuntu 安装包

#### macOS

```bash
# 构建 DMG 安装包
npm run build:mac

# 构建 ZIP 压缩包
electron-builder --mac zip
```

输出文件：
- `dist/flip-clock-1.0.0-x64.dmg` - DMG 安装包
- `dist/flip-clock-1.0.0-arm64.dmg` - Apple Silicon 版本

## 系统要求

### Windows
- Windows 10/11 (64位)
- Node.js 18+ （仅开发/构建时需要）

### Linux
- Ubuntu 18.04+ / Debian 10+ / CentOS 8+ / Fedora 30+ 等
- Node.js 18+ （仅开发/构建时需要）

### macOS
- macOS 10.14+ (Mojave)
- Node.js 18+ （仅开发/构建时需要）
- Xcode Command Line Tools （构建时需要）

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (jQuery)
- **桌面框架**：Electron 28
- **打包工具**：electron-builder
- **翻页动画**：CSS 3D 变换

## 自定义配置

### 修改字体大小

编辑 `style.css` 中的 `.flip-unit` 相关样式：

```css
.flip-unit {
    width: 80px;    /* 调整宽度 */
    height: 120px;  /* 调整高度 */
}

.flip-unit .top,
.flip-unit .bottom {
    font-size: 70px;  /* 调整字体大小 */
}
```

### 修改窗口大小

编辑 `main.js` 中的窗口配置：

```javascript
mainWindow = new BrowserWindow({
    width: 1000,   // 窗口宽度
    height: 500,   // 窗口高度
    // ...
});
```

### 修改背景颜色

编辑 `style.css` 中的 `body` 样式：

```css
body {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
```

## API 说明

应用使用以下 API 获取内容：
- 基础 URL: `https://api.p6oy.top/api/yy?type={type}`
- 类型参数：
  - `sc` - 诗词
  - `djt` - 毒鸡汤
  - `tgrj` - 舔狗日记
- 返回格式：JSON
- 字段：
  - `hitokoto`: 内容文本
  - `hitokoto_from`: 内容出处

## 常见问题

### Q: Windows 上运行 start.bat 提示 "未检测到 Node.js"？
A: 请先安装 Node.js：
1. 访问 https://nodejs.org/
2. 下载 Windows Installer (.msi)
3. 运行安装程序，按提示完成安装
4. 重新打开命令提示符或 PowerShell，再次运行

### Q: 如何生成 Windows 图标？
A: 
1. 将 `assets/icon.svg` 转换为 ICO 格式（256x256 或多尺寸）
2. 可以使用在线工具：https://convertio.co/svg-ico/
3. 保存为 `assets/icon.ico`

### Q: 构建时提示缺少依赖？
A: 
```bash
# 重新安装依赖
rm -rf node_modules
npm install

# Windows
del /s /q node_modules
npm install
```

### Q: AppImage 在 Linux 上无法运行？
A: 确保添加了执行权限：
```bash
chmod +x flip-clock-1.0.0-x86_64.AppImage
```

### Q: macOS 上提示 "无法打开，因为无法验证开发者"？
A: 
1. 右键点击应用，选择「打开」
2. 或在「系统偏好设置」→「安全性与隐私」中允许

### Q: 如何完全卸载？
A: 
- **Windows**：
  - 安装版：使用「添加或删除程序」卸载
  - 便携版：直接删除文件夹
  - 配置：`%APPDATA%/flip-clock`
  
- **Linux**：
  - AppImage：直接删除文件
  - deb 包：`sudo dpkg -r flip-clock`
  - 配置：`~/.config/flip-clock`
  
- **macOS**：
  - 将应用拖到废纸篓
  - 配置：`~/Library/Application Support/flip-clock`

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 翻页时钟动画效果
- 支持诗词、毒鸡汤、舔狗日记三种内容
- 支持系统时间、NTP同步、自定义时间
- 可配置刷新频率
- 跨平台支持（Windows、Linux、macOS）
