const { ipcMain, dialog } = require('electron')
const log = require('electron-log')

const mammoth = require('mammoth')
const fs = require('fs')
// const $ = require('jquery')
// window.$ = window.jQuery = require('jquery')

let MainWindow
exports.initMainWindow = (window) => {
  MainWindow = window

  ipcMain.on('IMPORT-DOCX-MULTI-CHAPTERS', function (event, book) {
    dialog.showOpenDialog(MainWindow, {
      properties: ['openFile', 'showOverwriteConfirmation'],
      filters: [
        { name: 'Doc Files', extensions: ['docx'] }
      ]
    }).then(result => {
      if (result.canceled) {

      } else {
        var outputFile = result.filePaths

        fs.readFile(outputFile[0], (err, data) => {
          if (err) throw err

          var options = {
            styleMap: [
              'u => u'
            ]
          }
          mammoth.convertToHtml(data, options)
            .then(function (result) {
              // console.log('testtse')
              // console.log(book)
              MainWindow.webContents.send('GET-DOCX-CONTENT-MULTI-CHAPTERS-2', {book: book, html: result.value})
            })
            .done()
        })
      }
    }).catch(err => {
      log.error(err)
    })
  })
}
