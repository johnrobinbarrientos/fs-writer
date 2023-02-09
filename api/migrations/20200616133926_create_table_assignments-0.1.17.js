const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('assignments').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('assignments', function (t) {
        t.increments(`id`) // int(10) unsigned NOT NULL AUTO_INCREMENT,
        t.string(`uuid`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`course_id`) // int(10) unsigned NOT NULL,
        t.text(`title`) // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`description`) // longtext COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`submission_date`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.date(`available_date`) // date DEFAULT NULL,
        t.text(`allowed_package`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.decimal(`add_on_price`, 11, 2) // decimal(11,2) DEFAULT 0.00,
        t.integer(`max_words`) // int(11) NOT NULL,
        t.integer(`for_editor`) // tinyint(4) NOT NULL,
        t.text(`editor_manu_generate_count`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.text(`generated_filepath`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.integer(`show_join_group_question`) // tinyint(4) NOT NULL DEFAULT 1,
        t.text(`created_at`) // timestamp NULL DEFAULT NULL,
        t.text(`updated_at`) // timestamp NULL DEFAULT NULL,
        t.text(`deleted_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate assignments to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'assignments exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('assignments').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('assignments').then(function () {
        log.info('Migrate assignments rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated assignments rollback error:' + err)
      })
    }
  })
}
