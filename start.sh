#!/bin/bash

# 翻页时钟启动脚本
# 支持多种方式启动

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "正在启动翻页时钟..."

# 检查是否有 Chrome/Chromium
if command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
elif command -v chromium &> /dev/null; then
    BROWSER="chromium"
elif command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
elif command -v firefox &> /dev/null; then
    BROWSER="firefox"
else
    echo "未找到支持的浏览器，请安装 Chrome、Chromium 或 Firefox"
    exit 1
fi

echo "使用浏览器: $BROWSER"

# 启动为无边框窗口应用
if [[ "$BROWSER" == *"chrome"* ]] || [[ "$BROWSER" == *"chromium"* ]]; then
    $BROWSER \
        --app="file://$SCRIPT_DIR/index.html" \
        --disable-infobars \
        --disable-session-crashed-bubble \
        --disable-features=TranslateUI \
        --no-first-run \
        --window-size=900,400 \
        --window-position=100,100 \
        --disable-background-networking \
        --disable-default-apps \
        --disable-extensions \
        --disable-sync \
        --disable-translate \
        --hide-scrollbars \
        --no-sandbox \
        2>/dev/null &
else
    # Firefox 或其他浏览器
    $BROWSER "file://$SCRIPT_DIR/index.html" 2>/dev/null &
fi

sleep 2
echo "翻页时钟已启动!"
