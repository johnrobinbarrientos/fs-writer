const log = require('electron-log')
exports.up = async function (knex) {
  /* TODO check the TABLE first before doing some changes , see: main.js
  * knexConnection.schema.hasTable('migration_version_control').then(async(exists)=>{})
  * */

  await knex.schema.hasTable('feedbacks').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('feedbacks', function (t) {
        t.increments('id')
        t.text('uuid')
        t.text('author_id')
        t.text('parent_id')
        t.text('parent')
        t.text('message')
        t.integer('is_done')
        t.text('created_at')
        t.text('updated_at')
        t.text('deleted_at')
      }).then(function () {
        log.info('Migrate to latest feedbacks: success')
      }).catch(function (err) {
        log.error('Migrate to latest feedbacks: error:' + err)
      })
    }
  })

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
  await knex.schema.dropTable('feedbacks').then(function () {
    log.info('Migrate feedbacks rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated feedbacks rollback error:' + err)
  })

  await knex.schema.dropTable('feedback_responses').then(function () {
    log.info('Migrate feedback_responses rollback successfuly')
  }).catch(function (err) {
    log.error('Migrated feedback_responses rollback error:' + err)
  })
}
