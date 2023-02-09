const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('feedbacks', 'is_seen').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('feedbacks', function (table) {
        table.boolean('is_seen')
      }).then(function () {
        log.info('Migration feedbacks is_seen new column comments : success')
      }).catch(function (err) {
        log.error('Migration feedbacks is_seen new column comments  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
