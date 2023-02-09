const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('webinars', function (t) {
    t.increments('id')
    t.text('uuid')
    t.text('course_id')
    t.text(`title`) // varchar(191) NOT NULL
    t.text(`description`) // longtext NOT NULL,
    t.text(`start_date`) // datetime NOT NULL,
    t.text(`image`) // varchar(191) NULL DEFAULT NULL,
    t.text(`webinar_id`) // varchar(191) NOT NULL,
    t.integer(`set_as_replay`) // tinyint(4) NOT NULL,
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
  await knex.schema.dropTable('webinars').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
