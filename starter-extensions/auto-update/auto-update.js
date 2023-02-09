/* eslint-disable no-undef,eqeqeq */
// Modules
// eslint-disable-next-line no-unused-vars
const {autoUpdater} = require('electron-updater')
const {app, ipcMain} = require('electron')
const log = require('electron-log')
const path = require('path')

// Enable logging
// autoUpdater.logger = require('electron-log')
// autoUpdater.logger.transports.file.level = 'error'
autoUpdater.logger = null
autoUpdater.autoInstallOnAppQuit = true
autoUpdater.autoDownload = false
let inProgress = false

exports.checkAppUpdates = () => {
  global.updateInfo = {
    hasUpdate: false,
    version: null
  }

  //   if(process.env.NODE_ENV !== 'production') return false
  if (process.env.NODE_ENV != 'production') return false

  process.env.GH_TOKEN = 'dfd1c61fcb090ecba24909875e177c5326ad449d'

  autoUpdater.checkForUpdates().then(() => {})

  // checking update every minute
  setInterval(function () {
    if (!inProgress) {
      if (process.env.NODE_ENV != 'production') return false
      autoUpdater.checkForUpdates().then(() => {})
    }
  }, 1 * 60 * 1000)
}

exports.processUpdate = (window) => {
  let version
  let downloadedVersion

  if (process.env.NODE_ENV != 'production' || window.closed) return false

  autoUpdater.on('update-downloaded', function (data) {
    inProgress = false
    downloadedVersion = data.version
    if (window) window.webContents.send('AUTO_UPDATE:downloaded', data)
    ipcMain.on('AUTO_UPDATE:checkUpdateDownloaded', (event) => {
      event.reply('AUTO_UPDATE:downloaded', data)
    })
  })

  autoUpdater.on('download-progress', function (d) {
    inProgress = true
    try {
      if (window) window.webContents.send('AUTO_UPDATE:downloadProgress', {progress: d.percent})
    } catch (err) {
      log.error(err.message)
    }
  })

  autoUpdater.on('error', function (err) {
    inProgress = false

    if (isNetworkError(err)) {
      if (window) window.webContents.send('AUTO_UPDATE:error', {error: err.message})
    } else {
      if (err.code != 'ERR_UPDATER_LATEST_VERSION_NOT_FOUND') {
        log.error(err)
      }
    }
  })

  autoUpdater.on('update-available', function (data) {
    // check available update
    version = data.version
    ipcMain.on('AUTO_UPDATE:checkUpdateAvailable', (event) => {
      if (downloadedVersion != version) {
        event.reply('AUTO_UPDATE:updateAvailable', {version: data.version})
      }
    })

    if (downloadedVersion != version && window) {
      window.webContents.send('AUTO_UPDATE:updateAvailable', {version: data.version})
    }
  })

  ipcMain.on('AUTO_UPDATE:downloadAppUpdate', (event) => {
    autoUpdater.downloadUpdate().then(() => {}).catch((err) => { log.error(err) })
    event.reply('AUTO_UPDATE:prepareDownload')
  })

  ipcMain.on('install-update', function (e, cat) {
    autoUpdater.quitAndInstall()
  })

  function isNetworkError (errorObject) {
    return errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
      errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
      errorObject.message === 'net::ERR_CONNECTION_RESET' ||
      errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
      errorObject.message === 'net::ERR_NAME_NOT_RESOLVED' ||
      errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT' ||
      errorObject.message === 'net::ERR_NETWORK_CHANGED' ||
      errorObject.message === 'net::ERR_TIMED_OUT' ||
      errorObject.message === 'No valid update available, can\'t quit and install'
  }
}

exports.checkForVersionUpdates = () => {
  let knexMigrate = require('knex-migrate')
  let data = {
    migrations: path.resolve(process.env.basePath, 'api/migrations')
  }

  knexConnection.schema.hasTable('migration_version_control').then(async (exists) => {
    if (exists) {
      await knexConnection.first().from('migration_version_control').orderByRaw('version_id DESC').then(function (res) {
        if (res) {
          data.from = res.name
        }
      })
    }

    let directoryPathName
    await knexMigrate('up', data, ({ action, migration }) => {
      log.info('Doing ' + action + ' on ' + migration)

      directoryPathName = migration.split(path.sep)
    }).then(function () {
      const { v1: uuidv1 } = require('uuid')
      /* generate_UID */
      if (Array.isArray(directoryPathName)) {
        knexConnection.table('migration_version_control').insert({
          'version_uid': uuidv1(),
          'full_path': data.migrations,
          'directory': directoryPathName[0],
          'name': directoryPathName[1],
          'created_at': knexConnection.fn.now(),
          'updated_at': knexConnection.fn.now()
        }).catch((err) => {
          log.error(err)
        })
      }
    }).catch((err) => {
      log.error(err)
    })
  }).catch((err) => {
    log.error(err)
  })
}

exports.initializeDatabase = () => {
  const fs = require('fs')
  const fsj = require('fs-jetpack')
  let src, dist
  if (process.env.NODE_ENV === 'development') {
    src = path.resolve(process.env.basePath, 'api', 'base.db')
    dist = path.resolve(process.env.basePath, 'config', 'db', 'development.db')
  } else {
    src = path.join(process.resourcesPath, 'app.asar', 'api', 'base.db')
    dist = path.resolve(app.getPath('userData'), 'resources', 'db', 'easywrite.db')
  }

  process.env.dblocation = dist

  if (fs.existsSync(src) && fs.statSync(src).isFile() && !fs.existsSync(dist)) {
    fsj.copy(src, dist)
    fs.chmod(dist, '0700', function (err) {
      if (err) {
        log.error(err)
      }
    })
    log.info('success initializeDatabase')
  } else if (fs.existsSync(dist)) {
    // for those who install v14-17
    fs.chmod(dist, '0700', function (err) {
      if (err) {
        log.error(err)
      }
    })
  }
}
