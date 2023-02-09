const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('webinar_presenters', function (t) {
    t.increments('id')
    t.text('uuid')
    t.text(`webinar_id`) // int(10) NOT NULL,
    t.text(`first_name`) // varchar(191) NOT NULL,
    t.text(`last_name`) // varchar(191) NOT NULL,
    t.text(`email`) // varchar(191) NOT NULL,
    t.text(`image`) // varchar(191) NULL DEFAULT NULL,
    t.text('created_at')
    t.text('updated_at')
    t.text('deleted_at')
  }).then(function () {
    log.info('Migrate to latest : success')
  }).catch(function (err) {
    log.error('Migrate to latest : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('webinar_presenters').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
