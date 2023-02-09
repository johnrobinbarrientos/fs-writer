const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
// const electron = require('electron')
const log = require('electron-log')
let exportWindow
exports.initMainWindow = (mainWindow) => {
  function createExportWindow (data) {
    exportWindow = new BrowserWindow({
      title: app.name + ' v' + app.getVersion(),
      icon: path.resolve('src/assets/img/easywrite-new.ico'),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        preload: path.resolve(process.env.basePath, 'preload.js'),
        plugins: true
      },
      protocol: 'file:',
      slashes: true,
      movable: true,
      show: false
    })
    // exportWindow.webContents.openDevTools()
    if (process.env.NODE_ENV === 'development') {
      exportWindow.webContents.openDevTools()
      let url = 'http://localhost:8080/'
      exportWindow.loadURL(url + 'dev/' + '/#/' + data.exportBy)
    } else {
      // if (process.platform === 'darwin') {
      //   /*
      //   * Apply this on MAC since mac didn't get any route
      //   * If you apply this on Window , it will load the route twice since it read the route and you add a export.html#route
      //   * */
      //   exportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html#' + data.exportBy))
      // } else {
      //   exportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html'))
      // }
      exportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html#' + data.exportBy))
    }

    exportWindow.on('closed', function () {
      exportWindow = null
    })
  }

  ipcMain.on('EXPORT_PDF_SHOW_CHARACTERS', function (event, data) {
    createExportWindow({exportBy: 'export-characters'})
    exportWindow.on('ready-to-show', function () {
      exportWindow.webContents.send('EXPORT_PDF_LIST_CHARACTERS', data.book)
      // exportWindow.show()
    })
  })

  ipcMain.on('EXPORT_PDF_SHOW_SCENE', function (event, data) {
    createExportWindow({exportBy: 'export-scenes', data: data})
    exportWindow.on('ready-to-show', function () {
      exportWindow.webContents.send('EXPORT_PDF_LIST_CHAPTERS', data)
      // exportWindow.show()
    })
  })

  ipcMain.on('EXPORT_PDF_CONFIRM_GENERATE', function (event, data) {
    let pdf = data.pdf
    dialog.showSaveDialog(mainWindow, {
      defaultPath: pdf.name,
      properties: ['openFile', 'openDirectory', 'showOverwriteConfirmation'],
      filters: [
        {name: 'PDF Files', extensions: ['pdf']}
      ]
    }).then(result => {
      if (result.canceled) {
        mainWindow.webContents.send('EXPORT_PDF_SHOW_BUTTON')
        if (exportWindow != null) exportWindow.close()
      } else {
        exportWindow.webContents.printToPDF({}, (success, errorType) => {
          log.error(errorType)
        }).then(function (htmlBuffer) {
          const pdfPath = path.resolve(result.filePath)
          fs.writeFile(pdfPath, htmlBuffer, function (error) {
            if (error) {
              log.error(error)
            }
            // electron.shell.openExternal('file://' + pdfPath)
            mainWindow.webContents.send('SHOW-SWAL-SUCCESS-EXPORTING', pdfPath)
            if (exportWindow != null) exportWindow.close()
          })
        }).catch(function (err) {
          log.error(err)
          if (exportWindow != null) exportWindow.close()
        })
      }
      mainWindow.webContents.send('EXPORT_PDF_ENABLE_BUTTON')
    }).catch(err => {
      if (exportWindow != null) exportWindow.close()
      log.error(err)
    })
  })
}
