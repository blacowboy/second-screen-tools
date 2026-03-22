#!/usr/bin/env node
/**
 * 生成应用图标
 * 需要安装 sharp: npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

async function createIcons() {
    try {
        const sharp = require('sharp');
        const svgPath = path.join(__dirname, 'assets', 'icon.svg');
        
        // 检查 SVG 文件是否存在
        if (!fs.existsSync(svgPath)) {
            console.error('❌ 找不到 assets/icon.svg');
            return false;
        }

        // 读取 SVG 文件
        const svgBuffer = fs.readFileSync(svgPath);

        console.log('🎨 正在生成图标...');

        // 生成 Windows ICO (多尺寸)
        const sizes = [16, 24, 32, 48, 64, 128, 256];
        const pngBuffers = await Promise.all(
            sizes.map(size => 
                sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toBuffer()
            )
        );

        // 保存 PNG 图标 (Linux/macOS 使用)
        await sharp(svgBuffer)
            .resize(256, 256)
            .png()
            .toFile(path.join(__dirname, 'assets', 'icon.png'));
        console.log('✅ 已生成: assets/icon.png (256x256)');

        // 生成 macOS ICNS (需要额外工具，这里生成大图标)
        await sharp(svgBuffer)
            .resize(512, 512)
            .png()
            .toFile(path.join(__dirname, 'assets', 'icon-512.png'));
        console.log('✅ 已生成: assets/icon-512.png (512x512)');

        console.log('\n✨ 图标生成完成!');
        console.log('\n注意: Windows ICO 和 macOS ICNS 需要额外工具:');
        console.log('  - Windows ICO: 使用在线转换工具或 icotools');
        console.log('  - macOS ICNS: 使用 iconutil 或在线转换工具');
        console.log('\n推荐在线工具: https://convertio.co/');
        
        return true;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('⚠️  未安装 sharp 模块');
            console.log('   运行: npm install sharp --save-dev');
            console.log('\n或者手动准备图标文件:');
            console.log('  - assets/icon.png (256x256) - Linux');
            console.log('  - assets/icon.ico (多尺寸) - Windows');
            console.log('  - assets/icon.icns - macOS');
        } else {
            console.error('❌ 生成图标失败:', error.message);
        }
        return false;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    createIcons();
}

module.exports = { createIcons };
