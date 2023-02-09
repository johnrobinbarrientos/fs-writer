const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('webinar_registrants', function (t) {
    t.increments('id')
    t.text('uuid')
    t.text(`webinar_id`) // int(10) NOT NULL,
    t.text(`user_id`) // int(10) NOT NULL,
    t.text(`join_url`)
    t.text('created_at')
    t.text('updated_at')
  }).then(function () {
    log.info('Migrate to latest : success')
  }).catch(function (err) {
    log.error('Migrate to latest : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('webinar_registrants').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
