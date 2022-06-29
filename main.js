// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu } = require('electron')
const path = require('path')


const menuTemplate = [
  // { role: 'appMenu' }
  ...(process.platform === 'darwin' ? [{
    label: 'ElectronTimer',
    submenu: [
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'styleMenu' }
  {
    label: 'Style',
    submenu: [
      { label: 'Timer', type: 'radio', checked: true, accelerator: 'CommandOrControl+T', click: styleChanged },
      { label: 'Clock', type: 'radio', accelerator: 'CommandOrControl+C', click: styleChanged },
      { label: 'Timestamp', type: 'radio', accelerator: 'CommandOrControl+M', click: styleChanged },
    ]
  },
  // { role: 'fontSizeMenu' }
  {
    label: 'Font size',
    submenu: [
      { label: 'Increase', accelerator: 'CommandOrControl+=', click: fontSizeChanged },
      { label: 'Decreate', accelerator: 'CommandOrControl+-', click: fontSizeChanged },
      { label: 'Default', accelerator: 'CommandOrControl+D', click: fontSizeChanged },
    ]
  },
  // { role: 'frameRateMenu' }
  {
    label: 'Frame rate',
    submenu: [
      { label: '240', type: 'radio', accelerator: 'CommandOrControl+4', click: frameRateChanged },
      { label: '120', type: 'radio', accelerator: 'CommandOrControl+2', click: frameRateChanged },
      { label: '90', type: 'radio', accelerator: 'CommandOrControl+9', click: frameRateChanged },
      { label: '60', type: 'radio', checked: true, accelerator: 'CommandOrControl+6', click: frameRateChanged },
      { label: '50', type: 'radio', click: frameRateChanged },
      { label: '40', type: 'radio', click: frameRateChanged },
      { label: '30', type: 'radio', accelerator: 'CommandOrControl+3', click: frameRateChanged },
      { label: '20', type: 'radio', click: frameRateChanged },
      { label: '15', type: 'radio', accelerator: 'CommandOrControl+5', click: frameRateChanged },
      { label: '10', type: 'radio', accelerator: 'CommandOrControl+1', click: frameRateChanged },
      { label: '5', type: 'radio', click: frameRateChanged },
      { label: '1', type: 'radio', click: frameRateChanged },
    ]
  },
  // { role: 'videoMenu' }
  {
    label: 'Video',
    submenu: [
      { label: '720p 30fps', type: 'radio', click: videoChanged },
      { label: '1080p 60fps', type: 'radio', click: videoChanged },
    ]
  },
  // { role: 'actionMenu' }
  {
    label: 'Action',
    submenu: [
      { label: 'Play', accelerator: 'CommandOrControl+P', click: actionChanged },
      { label: 'Clear', accelerator: 'CommandOrControl+L', click: actionChanged },
    ]
  }
]
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))



function styleChanged (menuItem, browserWindow, event) {

}

function fontSizeChanged (menuItem, browserWindow, event) {

}

function frameRateChanged (menuItem, browserWindow, event) {

}

function videoChanged (menuItem, browserWindow, event) {

}

function actionChanged (menuItem, browserWindow, event) {

}


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', function () {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
