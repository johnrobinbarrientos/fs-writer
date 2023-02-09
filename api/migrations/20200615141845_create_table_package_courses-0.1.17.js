const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('package_courses').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('package_courses', function (t) {
        t.increments(`id`) // int(10) unsigned NOT NULL AUTO_INCREMENT,
        t.text('uuid')
        t.string(`package_id`) // int(10) unsigned NOT NULL,
        t.string(`included_package_id`) // int(10) unsigned NOT NULL,
        t.text(`created_at`) // timestamp NULL DEFAULT NULL,
        t.text(`updated_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate package_courses to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'package_courses exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('package_courses').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('package_courses').then(function () {
        log.info('Migrate package_courses rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated package_courses rollback error:' + err)
      })
    }
  })
}
