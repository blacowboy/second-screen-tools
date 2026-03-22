#!/usr/bin/env python3
"""
生成应用图标
需要安装 cairosvg: pip install cairosvg
"""

import subprocess
import sys
import os

def create_icon():
    """使用 ImageMagick 或 cairosvg 将 SVG 转换为 PNG"""
    svg_path = "assets/icon.svg"
    png_path = "assets/icon.png"
    
    # 检查 SVG 文件是否存在
    if not os.path.exists(svg_path):
        print(f"错误: 找不到 {svg_path}")
        return False
    
    # 尝试使用 ImageMagick
    try:
        result = subprocess.run(
            ["convert", "-background", "none", svg_path, "-resize", "256x256", png_path],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ 图标已生成: {png_path}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    # 尝试使用 cairosvg
    try:
        import cairosvg
        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=256, output_height=256)
        print(f"✅ 图标已生成: {png_path}")
        return True
    except ImportError:
        pass
    except Exception as e:
        print(f"cairosvg 错误: {e}")
    
    # 尝试使用 Inkscape
    try:
        result = subprocess.run(
            ["inkscape", "--export-type=png", "--export-filename=" + png_path, 
             "--export-width=256", "--export-height=256", svg_path],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ 图标已生成: {png_path}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    print("⚠️  无法生成 PNG 图标，请手动安装以下工具之一:")
    print("   - ImageMagick: sudo apt install imagemagick")
    print("   - cairosvg: pip install cairosvg")
    print("   - Inkscape: sudo apt install inkscape")
    print("")
    print("   或者手动将 assets/icon.svg 转换为 256x256 的 PNG 并保存为 assets/icon.png")
    return False

if __name__ == "__main__":
    create_icon()
