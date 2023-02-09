const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('book_readers', 'reasons').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_readers', function (table) {
        table.text('reasons')
      }).then(function () {
        log.info('Migration book_readers new column reasons : success')
      }).catch(function (err) {
        log.error('Migration book_readers new column reasons  : error:' + err)
      })
    }
  })

  await knex.schema.hasColumn('book_readers', 'allow_feedback_email_notification').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('book_readers', function (table) {
        table.boolean('allow_feedback_email_notification').defaultTo(true)
      }).then(function () {
        log.info('Migration book_readers new column allow_feedback_email_notification : success')
      }).catch(function (err) {
        log.error('Migration book_readers new column allow_feedback_email_notification  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
