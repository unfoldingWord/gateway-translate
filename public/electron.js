// Modules to control application life and create native browser window
const path = require('path')
const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

// Uncomment next line to stop security warnings. Implications: https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// eliminate duplicate launch
if (require('electron-squirrel-startup')) app.quit();

console.log('starting electron...')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })


  // In react.js without next.js, the build start path is '../build/index.html'
  const url = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../.next/server/pages/index.html')}`

  console.log(`loading web page ${url}`)

  mainWindow.loadURL(url);

  // Open the DevTools on startup
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' }); // dev tools detached in separate window
  }}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.