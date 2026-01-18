const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
});

contextBridge.exposeInMainWorld('api', {
  checkAdmin: () => ipcRenderer.invoke('check-admin'),
  restartAsAdmin: () => ipcRenderer.invoke('restart-as-admin'),
  changeDns: (dnsServers) => ipcRenderer.invoke('change-dns', dnsServers),
  resetDns: () => ipcRenderer.invoke('reset-dns')
});
