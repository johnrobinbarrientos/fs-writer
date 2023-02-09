const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('assignment_manuscripts').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('assignment_manuscripts', function (t) {
        t.increments(`id`) // // int(10) // unsigned NOT NULL AUTO_INCREMENT,
        t.string(`uuid`) // // varchar(255) // COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`assignment_id`) // int(10) // unsigned NOT NULL,
        t.string(`user_id`) // int(10) // unsigned NOT NULL,
        t.text(`content`) // longtext COLLATE utf8mb4_unicode_ci NOT NULL,
        t.integer(`words`) // int(11) // NOT NULL DEFAULT 0,
        t.decimal(`grade`, 11, 2) // decimal(11,2) // DEFAULT NULL,
        t.integer(`genre`) // tinyint(4) // DEFAULT NULL,
        t.text(`where_in_script`) // tinyint(4) // DEFAULT NULL,
        t.integer(`locked`) // tinyint(4) // DEFAULT NULL,
        t.integer(`text_number`) // tinyint(4) // DEFAULT NULL,
        t.text(`editor_id`) // int(11) // NOT NULL DEFAULT 0,
        t.integer(`has_feedback`) // tinyint(4) // NOT NULL DEFAULT 0,
        t.integer(`join_group`) // tinyint(4) // NOT NULL DEFAULT 0,
        t.integer(`is_file`) // tinyint(4) NOT NULL DEFAULT 0,
        t.text(`created_at`) // timestamp NULL DEFAULT NULL,
        t.text(`updated_at`) // timestamp NULL DEFAULT NULL,
        t.text(`deleted_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate assignment_manuscripts to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'assignment_manuscripts exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('assignment_manuscripts').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('assignment_manuscripts').then(function () {
        log.info('Migrate assignment_manuscripts rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated assignment_manuscripts rollback error:' + err)
      })
    }
  })
}
