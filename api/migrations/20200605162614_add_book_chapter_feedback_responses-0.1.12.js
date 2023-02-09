const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('book_chapter_feedback_responses').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('book_chapter_feedback_responses', function (t) {
        t.increments('id')
        t.integer('uuid')
        t.integer('from')
        t.integer('chapter_feedback_id')
        t.integer('message')
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
  await knex.schema.dropTable('book_feedbacks').then(function () {
    log.info('Migrate book_feedbacks rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated book_feedbacks rollback error:' + err)
  })
}
