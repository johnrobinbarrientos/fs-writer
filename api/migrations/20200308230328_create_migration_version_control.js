const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('migration_version_control', function (t) {
    t.increments('version_id')
    t.string('version_uid')
    t.string('full_path')
    t.string('directory')
    t.string('name')
    t.timestamps()
  }).then(function () {
    log.info('Migrate to latest : success')
  }).catch(function (err) {
    log.error('Migrate to latest : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('migration_version_control').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
