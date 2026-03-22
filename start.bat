@echo off
chcp 65001 >nul
title 翻页时钟
echo ========================================
echo   翻页时钟 - Windows 启动脚本
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
) else (
    echo [信息] 依赖已安装
)

echo.
echo [信息] 正在启动翻页时钟...
echo.
npm start

if errorlevel 1 (
    echo.
    echo [错误] 启动失败
    pause
)
