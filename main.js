const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 禁用硬件加速，使用 CPU 渲染
app.disableHardwareAcceleration();

let mainWindow;
let configWindow;
let config = {
    timeSource: 'system',
    customTime: '',
    apiType: 'sc',
    refreshFrequency: 720 // 12小时（分钟）
};

const configPath = path.join(app.getPath('userData'), 'config.json');

// 加载配置
function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            const data = fs.readFileSync(configPath, 'utf8');
            config = { ...config, ...JSON.parse(data) };
        }
    } catch (error) {
        console.error('加载配置失败:', error);
    }
}

// 保存配置
function saveConfig() {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('保存配置失败:', error);
        return false;
    }
}

// 初始化配置
loadConfig();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        minWidth: 800,
        minHeight: 400,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'default',
        show: false,
        backgroundColor: '#1a1a2e',
        icon: path.join(__dirname, 'assets', 'icon.png'),
        fullscreen: true
    });

    mainWindow.loadFile('index.html');

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 创建右键菜单
    createContextMenu();
}

// 创建右键菜单
function createContextMenu() {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '配置',
            click: () => {
                createConfigWindow();
            }
        },
        {
            type: 'separator'
        },
        {
            label: '刷新',
            click: () => {
                mainWindow.reload();
            }
        },
        {
            type: 'separator'
        },
        {
            label: '退出',
            click: () => {
                app.quit();
            }
        }
    ]);

    // 为窗口设置右键菜单
    mainWindow.webContents.on('context-menu', (event, params) => {
        contextMenu.popup({
            window: mainWindow,
            x: params.x,
            y: params.y
        });
    });
}

// 创建配置窗口
function createConfigWindow() {
    if (configWindow) {
        configWindow.focus();
        return;
    }

    configWindow = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        modal: true,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        title: '配置',
        backgroundColor: '#1a1a2e'
    });

    configWindow.loadFile('config.html');

    configWindow.on('closed', () => {
        configWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 处理 IPC 消息
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

// 配置相关 IPC 事件
ipcMain.on('get-config', (event) => {
    event.sender.send('config-data', config);
});

ipcMain.on('save-config', (event, newConfig) => {
    config = { ...config, ...newConfig };
    const success = saveConfig();
    event.sender.send('config-saved', success);
    
    // 通知主窗口配置已更新
    if (mainWindow) {
        mainWindow.webContents.send('config-updated', config);
    }
});

ipcMain.on('close-config', (event) => {
    if (configWindow) {
        configWindow.close();
    }
});

// 发送配置给主窗口
ipcMain.handle('get-current-config', () => {
    return config;
});
