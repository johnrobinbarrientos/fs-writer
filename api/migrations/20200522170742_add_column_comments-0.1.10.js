const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('book_chapter_versions').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_chapter_versions', function (table) {
        table.text('comments')
      }).then(function () {
        log.info('Migration chapter_versions new column comments : success')
      }).catch(function (err) {
        log.error('Migration chapter_versions new column comments  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
