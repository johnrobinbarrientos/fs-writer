const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('feedback_responses').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('feedback_responses', function (t) {
        t.increments('id')
        t.integer('uuid')
        t.integer('author_id')
        t.integer('feedback_id')
        t.integer('message')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest feedbacks responses: success')
      }).catch(function (err) {
        log.error('Migrate to latest feedbacks responses: error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('feedback_responses').then(function () {
    log.info('Migrate feedback_responses rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated feedback_responses rollback error:' + err)
  })
}
