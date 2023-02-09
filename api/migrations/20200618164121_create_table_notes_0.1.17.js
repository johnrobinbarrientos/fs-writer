const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */

  await knex.schema.hasTable('notes').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('notes', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('author_id')
        t.text('parent_id')
        t.text('parent')
        t.text('message')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest notes: success')
      }).catch(function (err) {
        log.error('Migrate to latest notes: error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('notes').then(function () {
    log.info('Migrate notes rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated notes rollback error:' + err)
  })
}
