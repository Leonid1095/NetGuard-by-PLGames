const { app, BrowserWindow, ipcMain, Tray, Menu, dialog } = require('electron');
const path = require('path');

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
  tray = new Tray(path.join(__dirname, '../assets/icon.ico'));
  
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
