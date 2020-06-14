const {app, BrowserWindow} = require('electron')
const path = require('path');

let mainWindow;

function createWindow (webContents) {
  const window = new BrowserWindow({
    webPreferences: {
      nativeWindowOpen: true,
      devTools: true
    },
    webContents: webContents
  })

  window.webContents.session.protocol.registerFileProtocol('testing', (request, callback) => {
    callback(path.resolve(__dirname, '../index.html'));
  });

  window.loadURL('testing://index.html')

  window.webContents.openDevTools();

  window.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    event.preventDefault()
    const win = createWindow(options.webContents);
    event.newGuest = win;
  });

  return window;
}

app.on('ready', () => {
  console.log('started');
  mainWindow = createWindow();
  mainWindow.on('closed', () => {
    mainWindow = null
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

// Use the debug console to open child windows from the next child window
// window.open('https://youtube.com');
// window.open('https://github.com');
// window.open('testing://index.html');