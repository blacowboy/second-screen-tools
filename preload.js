const { contextBridge, ipcRenderer } = require('electron');

// 监听配置更新事件
ipcRenderer.on('config-updated', (event, config) => {
    window.dispatchEvent(new CustomEvent('config-updated', { detail: config }));
});

contextBridge.exposeInMainWorld('electronAPI', {
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getCurrentConfig: () => ipcRenderer.invoke('get-current-config')
});
