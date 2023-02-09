const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */

  await knex.schema.hasTable('author_names').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('author_names', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('first_name')
        t.text('last_name')
        t.text('alias')
        t.text('created_at')
        t.text('updated_at')
      }).then(function () {
        log.info('Migrate to latest author_names: success')
      }).catch(function (err) {
        log.error('Migrate to latest author_names: error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('author_names').then(function () {
    log.info('Migrate author_names rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated author_names rollback error:' + err)
  })
}
