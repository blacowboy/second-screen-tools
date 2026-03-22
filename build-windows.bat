@echo off
chcp 65001 >nul
title 翻页时钟 - Windows 构建脚本
echo ========================================
echo   翻页时钟 - Windows 构建脚本
echo ========================================
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Node.js
    echo.
    echo 请先安装 Node.js 18+:
    echo   1. 访问 https://nodejs.org/
    echo   2. 下载并安装 LTS 版本
echo.
    pause
    exit /b 1
)

echo [信息] Node.js 版本:
node --version
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [信息] 正在安装依赖...
    npm install
    if errorlevel 1 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成
    echo.
)

echo [信息] 请选择构建类型:
echo   1. 安装包 (NSIS) - 推荐
echo   2. 便携版 (Portable)
echo   3. ZIP 压缩包
echo   4. 全部构建
echo.

set /p choice="请输入选项 (1-4): "

echo.
echo [信息] 开始构建...
echo.

if "%choice%"=="1" (
    npm run build:win
) else if "%choice%"=="2" (
    npm run build:win:portable
) else if "%choice%"=="3" (
    electron-builder --win zip
) else if "%choice%"=="4" (
    npm run build:win
) else (
    echo [错误] 无效选项
    pause
    exit /b 1
)

if errorlevel 1 (
    echo.
    echo [错误] 构建失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   构建成功!
echo ========================================
echo.
echo 构建输出目录: dist\
echo.

REM 显示构建结果
if exist "dist" (
    echo [文件列表]
    dir /b dist\
    echo.
)

echo 按任意键退出...
pause >nul
