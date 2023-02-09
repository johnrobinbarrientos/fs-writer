const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('lessons').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('lessons', function (t) {
        t.increments(`id`)
        t.string(`uuid`) //    varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`course_id`) // int(10) unsigned NOT NULL,
        t.text(`title`) // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`content`) // longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`delay`) // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.integer(`order`) // tinyint(4) NOT NULL DEFAULT 0,
        t.string(`created_at`) // timestamp NULL DEFAULT NULL,
        t.string(`updated_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate lessons to latest : success')
      }).catch(function (err) {
        console.log(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'lessons exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('lessons').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('lessons').then(function () {
        log.info('Migrate lessons rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated lessons rollback error:' + err)
      })
    }
  })
}
