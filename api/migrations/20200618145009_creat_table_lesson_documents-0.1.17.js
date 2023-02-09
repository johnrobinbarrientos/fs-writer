const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('lesson_documents').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('lesson_documents', function (t) {
        t.increments(`id`)
        t.string(`uuid`) //    varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`lesson_id`) // int(10) unsigned NOT NULL,
        t.string(`name`) // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`document`) // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`created_at`) // timestamp NULL DEFAULT NULL,
        t.string(`updated_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate lesson_documents to latest : success')
      }).catch(function (err) {
        console.log(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'lesson_documents exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('lesson_documents').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('lesson_documents').then(function () {
        log.info('Migrate lesson_documents rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated lesson_documents rollback error:' + err)
      })
    }
  })
}
