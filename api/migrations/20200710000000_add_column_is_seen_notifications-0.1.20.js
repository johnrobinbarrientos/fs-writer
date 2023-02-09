const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('notifications', 'is_seen').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('notifications', function (table) {
        table.boolean('is_seen')
      }).then(function () {
        log.info('Migration notifications is_seen new column comments : success')
      }).catch(function (err) {
        log.error('Migration notifications is_seen new column comments  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
