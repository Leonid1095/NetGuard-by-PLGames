const { app, BrowserWindow, ipcMain, Tray, Menu, dialog, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isAdmin = require('is-admin');

let mainWindow;
let tray;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false,
    resizable: false,
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  mainWindow.show();

  // Обработчик закрытия окна - спросить или свернуть
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      showCloseDialog();
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

function createTray() {
  // Используем nativeImage для создания простой иконки
  const { nativeImage } = require('electron');
  
  // Создаём простую иконку 16x16 (минимальный размер для трея)
  const iconPath = path.join(__dirname, '../renderer/icon.png');
  let trayIcon;
  
  try {
    // Пробуем загрузить существующую иконку
    const fs = require('fs');
    if (fs.existsSync(iconPath)) {
      trayIcon = nativeImage.createFromPath(iconPath);
    } else {
      // Создаём пустую иконку если файла нет
      trayIcon = nativeImage.createEmpty();
    }
  } catch (e) {
    trayIcon = nativeImage.createEmpty();
  }
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🌐 NetGuard - DNS без компромиссов',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Открыть',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Выход',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('🌐 NetGuard - DNS без компромиссов');
  tray.setContextMenu(contextMenu);

  // Двойной клик на иконе трея - открыть приложение
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else {
      createWindow();
    }
  });
}

function showCloseDialog() {
  dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['Закрыть', 'Свернуть в трей'],
    title: 'NetGuard',
    message: 'Закрыть NetGuard?',
    detail: 'Приложение будет полностью завершено. Вы можете вернуться к нему из трея.',
  }).then((result) => {
    if (result.response === 0) {
      // Закрыть
      isQuitting = true;
      mainWindow.destroy();
      app.quit();
    } else {
      // Свернуть в трей
      mainWindow.hide();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  // На macOS приложения обычно остаются активными пока пользователь не выйдет явно
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for custom title bar
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.hide(); // Сворачиваем в трей вместо minimize
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.emit('close');
  }
});

// Проверка прав администратора
ipcMain.handle('check-admin', async () => {
  return await isAdmin();
});

// Перезапуск с правами администратора
ipcMain.handle('restart-as-admin', async () => {
  try {
    const exePath = process.execPath;
    const args = process.argv.slice(1);
    
    // Закрываем текущее приложение
    app.quit();
    
    // Запускаем новый экземпляр с правами администратора
    shell.openExternal(`powershell -Command "Start-Process '${exePath}' -ArgumentList '${args.join(' ')}' -Verb RunAs"`);
    
    return true;
  } catch (error) {
    console.error('Failed to restart as admin:', error);
    return false;
  }
});

// Изменение DNS настроек
ipcMain.handle('change-dns', async (event, dnsServers) => {
  return new Promise((resolve, reject) => {
    // Получаем имя активного сетевого адаптера
    const getAdapterCmd = 'Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1 -ExpandProperty Name';
    
    exec(`powershell -Command "${getAdapterCmd}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error getting adapter:', error);
        resolve({ success: false, error: 'Не удалось найти активный сетевой адаптер' });
        return;
      }
      
      const adapterName = stdout.trim();
      if (!adapterName) {
        resolve({ success: false, error: 'Активный сетевой адаптер не найден' });
        return;
      }
      
      // Формируем команду для изменения DNS
      const dnsAddresses = Array.isArray(dnsServers) ? dnsServers.join(',') : dnsServers;
      const changeDnsCmd = `Set-DnsClientServerAddress -InterfaceAlias "${adapterName}" -ServerAddresses ${dnsAddresses}`;
      
      exec(`powershell -Command "${changeDnsCmd}"`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error changing DNS:', error);
          resolve({ success: false, error: 'Не удалось изменить DNS. Убедитесь что приложение запущено от имени администратора.' });
          return;
        }
        
        console.log('DNS changed successfully to:', dnsAddresses);
        resolve({ success: true, adapter: adapterName, dns: dnsAddresses });
      });
    });
  });
});

// Сброс DNS на автоматические
ipcMain.handle('reset-dns', async () => {
  return new Promise((resolve, reject) => {
    const getAdapterCmd = 'Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1 -ExpandProperty Name';
    
    exec(`powershell -Command "${getAdapterCmd}"`, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, error: 'Не удалось найти активный сетевой адаптер' });
        return;
      }
      
      const adapterName = stdout.trim();
      const resetDnsCmd = `Set-DnsClientServerAddress -InterfaceAlias "${adapterName}" -ResetServerAddresses`;
      
      exec(`powershell -Command "${resetDnsCmd}"`, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, error: 'Не удалось сбросить DNS' });
          return;
        }
        
        console.log('DNS reset to automatic');
        resolve({ success: true });
      });
    });
  });
});
