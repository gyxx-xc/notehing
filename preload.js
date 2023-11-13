const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'electron',
  {
    startDrag: () => ipcRenderer.send("start-drag"),
    endDrag: () => ipcRenderer.send("end-drag")
  }
)
