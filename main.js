// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const { stat } = require('fs')


// BrowserWindow instance
var mainWindow = null

// Default menu item
var radioState = {
    'Style': 'Timer',
    'frameRate': '60',
}

// Frate rate menu position
var frateRatePos = {
    '240': 0,
    '120': 1,
    '90': 2,
    '60': 3,
    '50': 4,
    '40': 5,
    '30': 6,
    '20': 7,
    '15': 8,
    '10': 9,
    '5': 10,
    '1': 11,
}



function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
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


// Create menu
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
            { label: 'Timer', type: 'radio', checked: true, accelerator: 'CommandOrControl+T', click: function (menuItem, browserWindow, event) { menuItemClicked('Style', menuItem) } },
            { label: 'Clock', type: 'radio', accelerator: 'CommandOrControl+K', click: function (menuItem, browserWindow, event) { menuItemClicked('Style', menuItem) } },
            { label: 'Timestamp', type: 'radio', accelerator: 'CommandOrControl+M', click: function (menuItem, browserWindow, event) { menuItemClicked('Style', menuItem) } },
        ]
    },
    // { role: 'fontSizeMenu' }
    {
        label: 'Font size',
        submenu: [
            { label: 'Increase', accelerator: 'CommandOrControl+=', click: function (menuItem, browserWindow, event) { menuItemClicked('fontSize', menuItem) } },
            { label: 'Decrease', accelerator: 'CommandOrControl+-', click: function (menuItem, browserWindow, event) { menuItemClicked('fontSize', menuItem) } },
            { label: 'Default', accelerator: 'CommandOrControl+D', click: function (menuItem, browserWindow, event) { menuItemClicked('fontSize', menuItem) } },
        ]
    },
    // { role: 'frameRateMenu' }
    {
        label: 'Frame rate',
        submenu: [
            { label: '240', type: 'radio', accelerator: 'CommandOrControl+4', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '120', type: 'radio', accelerator: 'CommandOrControl+2', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '90', type: 'radio', accelerator: 'CommandOrControl+9', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '60', type: 'radio', checked: true, accelerator: 'CommandOrControl+6', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '50', type: 'radio', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '40', type: 'radio', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '30', type: 'radio', accelerator: 'CommandOrControl+3', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '20', type: 'radio', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '15', type: 'radio', accelerator: 'CommandOrControl+5', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '10', type: 'radio', accelerator: 'CommandOrControl+1', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '5', type: 'radio', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
            { label: '1', type: 'radio', click: function (menuItem, browserWindow, event) { menuItemClicked('frameRate', menuItem) } },
        ]
    },
    // { role: 'tickMenu' }
    {
        label: 'Tick',
        submenu: [
            { label: 'Play', accelerator: 'CommandOrControl+P', click: function (menuItem, browserWindow, event) { menuItemClicked('Tick', menuItem) } },
            { label: 'Clear', accelerator: 'CommandOrControl+L', click: function (menuItem, browserWindow, event) { menuItemClicked('Tick', menuItem) } },
            { label: 'Hide', accelerator: 'CommandOrControl+H', click: function (menuItem, browserWindow, event) { menuItemClicked('Tick', menuItem) } },
        ]
    },
    // { role: 'videoMenu' }
    {
        label: 'Video',
        submenu: [
            { label: '720p 30fps', accelerator: 'CommandOrControl+Alt+7', click: function (menuItem, browserWindow, event) { menuItemClicked('Video', menuItem) } },
            { label: '1080p 60fps', accelerator: 'CommandOrControl+Alt+1', click: function (menuItem, browserWindow, event) { menuItemClicked('Video', menuItem) } },
            { label: 'Play', visible: false, accelerator: 'CommandOrControl+Alt+P', click: function (menuItem, browserWindow, event) { menuItemClicked('Video', menuItem) } },
            { label: 'Pause', visible: false, accelerator: 'CommandOrControl+Shift+P', click: function (menuItem, browserWindow, event) { menuItemClicked('Video', menuItem) } },
            { label: 'Stop', visible: false, accelerator: 'CommandOrControl+Alt+S', click: function (menuItem, browserWindow, event) { menuItemClicked('Video', menuItem) } },
        ]
    },
]
Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))



// Handle menu item click event
function menuItemClicked(menu, item) {
    // No repeated clicks
    if (item.type == 'radio') {
        if (radioState[menu] == item.label) {
            return
        }
        else {
            radioState[menu] = item.label
        }
    }

    // Notify renderer
    mainWindow.webContents.send('menuItemClicked', { menu: menu, item: item.label })

    if (menu == 'Tick') {
        // Update tick menu
        if (item.label == 'Play') {
            menuTemplate[menuTemplate.length - 2].submenu[0].label = 'Pause'
            Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
        }
        else if (item.label == 'Pause' || item.label == 'Clear' || item.label == 'Hide') {
            menuTemplate[menuTemplate.length - 2].submenu[0].label = 'Play'
            Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
        }
    }
    else if (menu == 'frameRate') {
        // Remember frame rate menu
        for (let i = 0; i < Object.keys(frateRatePos).length; i++) {
            menuTemplate[menuTemplate.length - 3].submenu[i].checked = false
        }
        menuTemplate[menuTemplate.length - 3].submenu[frateRatePos[item.label]].checked = true
    }
}


// Handle video player event
ipcMain.on('video', function (event, state) {
    if (state == 'play') {
        // disable play
        menuTemplate[menuTemplate.length - 1].submenu[2].visible = false
        // enable pause
        menuTemplate[menuTemplate.length - 1].submenu[3].visible = true
        // enable stop
        menuTemplate[menuTemplate.length - 1].submenu[4].visible = true
        // update tick state
        menuTemplate[menuTemplate.length - 2].submenu[0].label = 'Pause'
        // reload menu
        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
    }
    else if (state == 'pause') {
        // disable play
        menuTemplate[menuTemplate.length - 1].submenu[2].visible = true
        // enable pause
        menuTemplate[menuTemplate.length - 1].submenu[3].visible = false
        // enable stop
        menuTemplate[menuTemplate.length - 1].submenu[4].visible = true
        // update tick state
        menuTemplate[menuTemplate.length - 2].submenu[0].label = 'Play'
        // reload menu
        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
    }
    else if (state == 'stop') {
        // disable play
        menuTemplate[menuTemplate.length - 1].submenu[2].visible = false
        // disable pause
        menuTemplate[menuTemplate.length - 1].submenu[3].visible = false
        // disable stop
        menuTemplate[menuTemplate.length - 1].submenu[4].visible = false
        // reload menu
        Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
    }
})