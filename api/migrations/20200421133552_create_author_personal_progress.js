const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.createTable('author_personal_progress', function (t) {
    t.increments('id')
    t.string('uuid')
    t.integer('author_id')
    t.integer('relation_id')
    t.integer('total_words')
    t.string('is_for')
    t.timestamps()
    t.string('deleted_at')
  }).then(function () {
    log.info('Migrate to latest : success')
  }).catch(function (err) {
    log.error('Migrate to latest : error:' + err)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('author_personal_progress').then(function () {
    log.info('Migrate rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated rollback error:' + err)
  })
}
