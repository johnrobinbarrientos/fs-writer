const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.hasTable('book_chapter_feedbacks').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('book_chapter_feedbacks', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('from')
        t.text('to')
        t.text('chapter_id')
        t.text('chapter_version_id')
        t.text('mark')
        t.integer('published')
        t.text('type')
        t.integer('mark_as_finished')
        t.text('general_comment')
        t.text('book_chapter_comment')
        t.text('message')
        t.dateTime('created_at')
        t.dateTime('updated_at')
        t.dateTime('deleted_at')
      }).then(function () {
        log.info('Migrate to latest book_chapter_feedbacks: success')
      }).catch(function (err) {
        log.error('Migrate to latest book_chapter_feedbacks: error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('book_chapter_feedbacks').then(function () {
    log.info('Migrate book_chapter_feedbacks rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated book_chapter_feedbacks rollback error:' + err)
  })
}
