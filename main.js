// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // We cannot require the screen module until the app is ready.
  const { screen } = require('electron')

  // https://zhuanlan.zhihu.com/p/112564936
  // set position seens not work normally on my linux...
  // it keeps resize my window bigger. QwQ
  // setbounds is still growing a bit
  // but it's much better, is a acceptable
  var movingInterval;
  var rightClickMoved = false;
  ipcMain.on("start-drag", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    const winPosition = win.getBounds();
    const winSize = {w: winPosition.width, h: winPosition.height}
    winStartPosition = { x: winPosition.x, y: winPosition.y };
    mouseStartPosition = screen.getCursorScreenPoint();
    if (movingInterval) {
      clearInterval(movingInterval);
    }
      movingInterval = setInterval(() => {
        const cursorPosition = screen.getCursorScreenPoint();
        const moveOffsetSum = Math.abs(cursorPosition.x - mouseStartPosition.x) +
              Math.abs(cursorPosition.y - mouseStartPosition.y);
        // determinated is move or just some disturplance
        if (moveOffsetSum <= 4) {
          rightClickMoved = false; // single right click only
        } else if (moveOffsetSum <= 10) {
          rightClickMoved = true;
        } else {
          const x = winStartPosition.x +
                cursorPosition.x - mouseStartPosition.x;
          const y = winStartPosition.y +
                cursorPosition.y - mouseStartPosition.y;
          win.setBounds({x:x, y:y,
                         width:winSize.w, height:winSize.h},
                        true);
        }
      }, 5);
  })

  ipcMain.on("end-drag", () => {
    if (movingInterval) {
      clearInterval(movingInterval);
    }
    movingInterval = null;
    if (!rightClickMoved) {
      console.log("show menu");
    }
  })

})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
