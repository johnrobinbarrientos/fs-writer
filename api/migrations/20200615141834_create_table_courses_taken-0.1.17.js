const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('courses').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('courses', function (t) {
        t.increments(`id`)
        t.string(`uuid`) //    varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`title`).notNullable() //   varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`description`).notNullable() //   longtext COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`short_description`) //   varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`image`).notNullable() //   varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`type`).notNullable() //   varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`email`) //   longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.text(`course_plan`) //   longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.text(`course_plan_data`) //   longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`instructor`) //   varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.dateTime(`start_date`) //  date DEFAULT NULL,
        t.dateTime(`end_date`) //  date DEFAULT NULL,
        t.integer(`extend_courses`).defaultTo(0) //  int(11) DEFAULT 0,
        t.integer(`display_order`).defaultTo(0) //  int(11) DEFAULT 0,
        t.integer(`for_sale`).defaultTo(1) //  tinyint(4) DEFAULT 1,
        t.integer(`status`).defaultTo(1) //  tinyint(4) DEFAULT 1,
        t.integer(`is_free`).defaultTo(0) //  tinyint(1) DEFAULT 0,
        t.integer(`auto_list_id`).defaultTo(0) //  int(11) DEFAULT 0,
        t.string(`photographer`) //  varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.integer(`hide_price`).defaultTo(0) //  tinyint(1) DEFAULT 0,
        t.integer(`student_discount`) //  int(11) DEFAULT NULL,
        t.dateTime(`created_at`) //  timestamp NULL DEFAULT NULL,
        t.dateTime(`updated_at`) //  timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate courses to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'course exist'
      log.error(err)
    }
  })

  await knex.schema.hasTable('courses_taken').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('courses_taken', function (t) {
        t.increments(`id`) // int(10) unsigned NOT NULL AUTO_INCREMENT,
        t.string(`uuid`) // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.string(`user_id`).notNullable() // int(10) unsigned NOT NULL,
        t.string(`package_id`).notNullable() // int(10) unsigned NOT NULL,
        t.integer(`is_active`).notNullable().defaultTo(1) // tinyint(4) NOT NULL DEFAULT 1,
        t.dateTime(`started_at`) // datetime DEFAULT NULL,
        t.date(`start_date`) // date DEFAULT NULL,
        t.date(`end_date`) // date DEFAULT NULL,
        t.text(`access_lessons`).notNullable().defaultTo('[]') // varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
        t.integer(`years`).notNullable().defaultTo(1) // tinyint(4) NOT NULL DEFAULT 1,
        t.integer(`sent_renew_email`).notNullable().defaultTo(0) // tinyint(4) NOT NULL DEFAULT 0,
        t.integer(`is_free`).defaultTo(0) // tinyint(4) DEFAULT 0,
        t.text(`created_at`) // timestamp NULL DEFAULT NULL,
        t.text(`updated_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate courses_taken to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'courses_taken exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('courses_taken').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('courses_taken  ').then(function () {
        log.info('Migrate courses_taken rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated courses_taken rollback error:' + err)
      })
    }
  })

  await knex.schema.hasTable('courses').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('courses').then(function () {
        log.info('Migrate courses rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated courses rollback error:' + err)
      })
    }
  })
}
