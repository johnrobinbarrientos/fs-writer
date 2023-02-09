const certificate = require("./../certificate/certificate.env")
process.env.APPLE_ID = certificate.APPLE_ID
process.env.APPLE_PASSOWRD = certificate.APPLE_PASSOWRD
process.env.APPLE_TEAMSHORTNAME = certificate.APPLE_TEAMSHORTNAME
const { notarize } = require('electron-notarize')
const log = require('electron-log')
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename
  const options = {
    appBundleId: 'es.easywrite.easywrite',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_PASSOWRD,
    ascProvider: process.env.APPLE_TEAMSHORTNAME
  }

  return await notarize(options).catch(function (err) {
    log.error(err)
  });
};
