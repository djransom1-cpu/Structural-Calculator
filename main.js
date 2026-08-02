const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 868,
    minWidth: 1024,
    minHeight: 700,
    title: "Structural Engineering Suite",
    icon: path.join(__dirname, 'icons/icon-512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  mainWindow.loadFile('index.html');

  // Custom Desktop Application Menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'Projects Hub', click: () => mainWindow.webContents.executeJavaScript("document.getElementById('openHubBtn').click()") },
        { label: 'Save As...', click: () => mainWindow.webContents.executeJavaScript("document.getElementById('saveAsProjBtn').click()") },
        { label: 'Print Submittal Package', accelerator: 'CmdOrCtrl+P', click: () => mainWindow.webContents.executeJavaScript("document.getElementById('printReportBtn').click()") },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'ASCE 7 Wind Calculator', click: () => mainWindow.webContents.executeJavaScript("document.querySelector('.open-wind-calc-btn').click()") },
        { label: 'Toggle Light/Dark Theme', click: () => mainWindow.webContents.executeJavaScript("document.getElementById('themeToggleBtn').click()") }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
