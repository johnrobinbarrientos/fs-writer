const { ipcMain, dialog, app, BrowserWindow } = require('electron')
const log = require('electron-log')
const path = require('path')
const HtmlDocx = require('html-docx-js')
const fs = require('fs')

let ExportWindow, MainWindow

exports.initMainWindow = (window) => {
  MainWindow = window
  ipcMain.on('EXPORT-CONTENT-DOCX', function (e, cat) {
    dialog.showSaveDialog(MainWindow, {
      defaultPath: cat.defaultfilename,
      properties: ['openFile', 'openDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled === false) {
        var outputFile = result.filePath
        var docx = HtmlDocx.asBlob(cat.content)
        fs.writeFile(outputFile, docx, function (err) {
          if (err) {
            MainWindow.webContents.send('SHOW-SWAL-ERROR-EXPORTING', result.filePath)
          } else {
            MainWindow.webContents.send('SHOW-SWAL-SUCCESS-EXPORTING', result.filePath)
          }
        })
      }
      MainWindow.webContents.send('EXPORT_DOCX_ENABLE_BUTTON')
    }).catch(() => {})
  })

  ipcMain.on('EXPORT-DOCX-SHOW-BOOK-WINDOW', function (event, data) {
    createExportWindowBook({exportBy: 'export-book'})
    ExportWindow.on('ready-to-show', function () {
      // ExportWindow.show()
      ExportWindow.webContents.send('EXPORT-DOCX-GET-BOOK', data)
    })
  })

  ipcMain.on('EXPORT-WORD-BOOK', function (event, data) {
    dialog.showSaveDialog(ExportWindow, {
      defaultPath: data.book.title,
      properties: ['openFile', 'openDirectory', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled) {
        ExportWindow.webContents.send('SHOW-EXPORT-SETTINGS')
        if (ExportWindow != null) ExportWindow.close()
      } else {
        var HtmlDocx = require('html-docx-js')
        var fs = require('fs')

        var outputFile = result.filePath
        var docx = HtmlDocx.asBlob(data.html)
        fs.writeFile(outputFile, docx, function (err) {
          if (err) {
            if (ExportWindow != null) ExportWindow.close()
            MainWindow.webContents.send('SHOW-SWAL-ERROR-EXPORTING', result.filePath)
            ExportWindow.webContents.send('SHOW-EXPORT-SETTINGS')
            MainWindow.webContents.send('CHANGE-EXPORT-BOOK-BUTTON-NAME')
          } else {
            if (ExportWindow != null) ExportWindow.close()
            MainWindow.webContents.send('SHOW-SWAL-SUCCESS-EXPORTING', result.filePath)
            MainWindow.webContents.send('CHANGE-EXPORT-BOOK-BUTTON-NAME')
          }
        })
      }
      MainWindow.webContents.send('SET-EXPORT-BOOK-BUTTON-ENABLE')
    }).catch(err => {
      MainWindow.webContents.send('SHOW-SWAL-ERROR-EXPORTING', 'FAILED TO SAVE')
      if (ExportWindow != null) ExportWindow.close()
      log.error(err)
    })
  })

  function createExportWindowBook (data) {
    ExportWindow = new BrowserWindow({
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
    ExportWindow.setSize(1280, 920)
    ExportWindow.center()
    ExportWindow.setMenu(null)

    if (process.env.NODE_ENV === 'development') {
      ExportWindow.webContents.openDevTools()
      let url = 'http://localhost:8080/'
      ExportWindow.loadURL(url + 'dev/' + '/#/export-book')
    } else {
      // if (process.platform === 'darwin') {
      //   /*
      //   * Apply this on MAC since mac didn't get any route
      //   * If you apply this on Window , it will load the route twice since it read the route and you add a export.html#route
      //   * */
      //   ExportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html#' + data.exportBy))
      // } else {
      //   ExportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html'))
      // }
      ExportWindow.loadURL('file://' + path.resolve(__dirname, '../../../dist/export.html#' + data.exportBy))
    }

    ExportWindow.on('closed', function () {
      ExportWindow = null
      MainWindow.webContents.send('CHANGE-EXPORT-BOOK-BUTTON-NAME')
    })
  }
}
