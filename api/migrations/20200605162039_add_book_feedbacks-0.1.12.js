const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */
  await knex.schema.hasTable('book_feedbacks').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('book_feedbacks', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('from')
        t.text('to')
        t.text('book_id')
        t.text('feedback_id')
        t.text('mark')
        t.integer('published')
        t.text('type')
        t.integer('mark_as_finished')
        t.text('general_comment')
        t.text('book_chapter_comment')
        t.text('message')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest book_feedbacks: success')
      }).catch(function (err) {
        log.error('Migrate to latest book_feedbacks: error:' + err)
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
