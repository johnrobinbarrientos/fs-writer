'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'
const app = require('../package');
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const builder = require('electron-builder')
const Platform = builder.Platform
const spinner = ora('building for production...')
const moment = require('moment')
spinner.start()
const certificate = require("./certificate/certificate.env")
// process.env.CSS_NAME = certificate.CSS_NAME
process.env.CSC_KEY_PASSWORD = certificate.CSC_KEY_PASSWORD
let buildOptions = {
  "appId": "es.easywrite.easywrite",
  "productName": app.name,
  "directories": {
    "output": "output/" + app.version +'-'+ moment().format('YYYY-MM-DD-hhmmss').toString()
  },
  "extraResources": [
    {
      "from": "./resources/prod.env",
      "to": "./",
      "filter": [
        "**/*"
      ]
    },
    {
      "from": "./src/assets/img/default-image.jpg",
      "to": "./src/assets/img/default-image.jpg",
      "filter": [
        "**/*"
      ]
    }
  ],
  "files": [
    "**/*",
    "!**src/*",
    "!**config/*",
    "!**icons/*",
    "!**test/*",
    "!**private/*",
    "!**static/*",
    "!**output/*",
    "!*.db",
    "!**db/*",
    "!**resources/*"
  ],
  "mac": {
    "category": "public.app-category.productivity",
    "target": ["dmg","zip"],
    "icon": path.resolve('src/assets/img/easywrite.png'),
    "publish" : [{
      "provider": "github",
      "private": true,
      "token": "dfd1c61fcb090ecba24909875e177c5326ad449d",
      "owner": "rancorfloydz",
      "repo": "easywrite-mac"
    }],
    "provisioningProfile": path.resolve('build/certificate/EasyWrite.provisionprofile'),
    "hardenedRuntime" : true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64",
          "ia32"
        ]
      }
    ],
    "icon": path.resolve('build/icons/win/easywrite-new.ico'),
    "publish" : [{
      "provider": "github",
      "private": true,
      "token": "dfd1c61fcb090ecba24909875e177c5326ad449d",
      "owner": "rancorfloydz",
      //"repo": "easywrite-v2-updater"
      "repo": "easywrite"
    }],
    "certificateFile" : "build/certificate/easywrite.pfx",
    "verifyUpdateCodeSignature" : true,
    "certificatePassword": process.env.CSC_KEY_PASSWORD
  },
  "nsis": {
    // "oneClick": false
    "perMachine": true,
    "installerIcon": path.resolve('build/icons/win/installer.ico'),
    "uninstallerIcon": path.resolve('build/icons/win/installer.ico'),
    "allowToChangeInstallationDirectory": false,//for release update
    "oneClick": true //for release update
  },
  "dmg": {
    "title": app.name + ' ' + app.version + ' Setup',
    "sign": false
  },
  "afterSign": "build/scripts/notarize.js"
}

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {

    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  WebPack complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
    spinner.stop()

    if(process.env.IS_UPDATE != 'true') {
      spinner.start()
      let target = (process.platform === 'darwin') ? Platform.MAC.createTarget() : Platform.WINDOWS.createTarget();

      if(process.env.IS_PUBLISH == 'true'){
        console.log(chalk.greenBright('\n\n BUILDING AND PUBLISHING !!!.\n\n'))
      }

      /*
      * This will create the builds base on the options above and based on the target
      * */
      builder.build({
        targets: target,
        config: buildOptions,
        publish : process.env.IS_PUBLISH || 'never'
      }).then(() => {
        console.log(chalk.green('\n\nBuild complete.\n'))
        spinner.stop()
        process.exit(0);
      }).catch(err =>{
        console.log(err)
      })
    }
  })



})
