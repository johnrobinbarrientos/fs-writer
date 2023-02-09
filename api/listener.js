this.loadApi = function (mainWindow) {
  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('did-finish-load', () => {
    // eslint-disable-next-line no-undef
    mainWindow.webContents.send('ping', 'whoooooooh!')
  })

  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('ipc-message', (event, channel, args) => {
    /*
    console.log('IPC-MESSAGE: ' + channel)
    console.log('IPC-MESSAGE ARGS: ' + args)

    if (channel === '/books/get') {
      let books
      books = book.getAuthorBooks(db, args)
      event.sender.send(channel, 'RESPONSE FROM IPC' + books)
    }
    */
  })

  // eslint-disable-next-line no-undef
  mainWindow.webContents.on('ipc-message-sync', async (event, channel, args) => {

  })
}
