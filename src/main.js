const {app, BrowserWindow} = require('electron')

let mainWindow;

function createWindow (webContents) {
  const window = new BrowserWindow({
    webPreferences: {
      nativeWindowOpen: true,
      devTools: true
    },
    webContents: webContents
  })

  window.loadURL('http://github.com');

  window.webContents.openDevTools();

  window.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    try {
      event.preventDefault()
      const win = createWindow(options.webContents);
      win.loadURL(url);
      event.newGuest = win;
    }
    catch (e) {
      console.log(`Error when creating new window: ${e.error}`);
    }
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
// window.open('http://github.com');