const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('book_scene_versions').then(async (exists) => {
    await knex.schema.table('book_scene_versions', function (table) {
      table.text('comments')
    }).then(function () {
      log.info('Migration book_scene_versions new column comments : success')
    }).catch(function (err) {
      log.error('Migration book_scene_versions new column comments  : error:' + err)
    })
  })
}

exports.down = async function (knex) {}
