#!/bin/bash

# 翻页时钟安装脚本
# 自动安装依赖并打包成可执行文件

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="翻页时钟"

echo "========================================"
echo "  翻页时钟 - 安装脚本"
echo "========================================"
echo ""

# 检查是否安装了 Node.js
check_node() {
    if ! command -v node &> /dev/null; then
        echo "❌ 未检测到 Node.js"
        echo ""
        echo "请安装 Node.js 18+ :"
        echo "  Ubuntu/Debian: sudo apt install nodejs npm"
        echo "  CentOS/RHEL:   sudo yum install nodejs npm"
        echo "  或使用 nvm:    https://github.com/nvm-sh/nvm"
        echo ""
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo "⚠️  Node.js 版本过低 (需要 18+)"
        echo "当前版本: $(node --version)"
        echo ""
        exit 1
    fi
    
    echo "✅ Node.js 版本: $(node --version)"
}

# 安装依赖
install_dependencies() {
    echo ""
    echo "📦 正在安装依赖..."
    cd "$SCRIPT_DIR"
    
    if [ -d "node_modules" ]; then
        echo "   依赖已存在，跳过安装"
    else
        npm install
        echo "✅ 依赖安装完成"
    fi
}

# 构建应用
build_app() {
    echo ""
    echo "🔨 正在构建应用..."
    cd "$SCRIPT_DIR"
    
    # 清理之前的构建
    rm -rf dist
    
    # 构建 Linux 版本
    npm run build:appimage
    
    echo "✅ 构建完成"
}

# 创建启动脚本
create_launcher() {
    echo ""
    echo "🚀 创建启动脚本..."
    
    # 创建桌面入口脚本
    cat > "$SCRIPT_DIR/flip-clock.sh" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 查找 AppImage 文件
APPIMAGE=$(find "$SCRIPT_DIR/dist" -name "*.AppImage" -type f 2>/dev/null | head -n1)

if [ -n "$APPIMAGE" ]; then
    chmod +x "$APPIMAGE"
    "$APPIMAGE" "$@"
else
    # 如果没有 AppImage，使用 npm start
    cd "$SCRIPT_DIR"
    npm start
fi
EOF

    chmod +x "$SCRIPT_DIR/flip-clock.sh"
    echo "✅ 启动脚本已创建: flip-clock.sh"
}

# 创建桌面快捷方式
create_desktop_entry() {
    echo ""
    echo "🖥️  创建桌面快捷方式..."
    
    DESKTOP_FILE="$SCRIPT_DIR/flip-clock.desktop"
    
    cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=翻页时钟
Comment=精美的翻页时钟桌面应用
Exec=$SCRIPT_DIR/flip-clock.sh
Icon=$SCRIPT_DIR/assets/icon.png
Type=Application
Categories=Utility;Clock;
Terminal=false
StartupNotify=true
EOF

    chmod +x "$DESKTOP_FILE"
    
    # 复制到系统应用目录（可选）
    read -p "是否安装到系统应用菜单? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -d "$HOME/.local/share/applications" ]; then
            cp "$DESKTOP_FILE" "$HOME/.local/share/applications/"
            echo "✅ 已安装到用户应用菜单"
        fi
        
        if command -v update-desktop-database &> /dev/null; then
            update-desktop-database "$HOME/.local/share/applications/" 2>/dev/null || true
        fi
    fi
    
    echo "✅ 桌面快捷方式已创建"
}

# 显示使用说明
show_usage() {
    echo ""
    echo "========================================"
    echo "  安装完成!"
    echo "========================================"
    echo ""
    echo "使用方式:"
    echo ""
    echo "1. 直接运行:"
    echo "   ./flip-clock.sh"
    echo ""
    echo "2. 双击桌面快捷方式:"
    echo "   flip-clock.desktop"
    echo ""
    echo "3. 开发模式运行:"
    echo "   npm start"
    echo ""
    echo "4. 构建安装包:"
    echo "   npm run build:deb      # 构建 .deb 包"
    echo "   npm run build:appimage # 构建 AppImage"
    echo ""
    echo "构建输出目录: dist/"
    echo ""
}

# 主流程
main() {
    check_node
    install_dependencies
    build_app
    create_launcher
    create_desktop_entry
    show_usage
}

main "$@"
