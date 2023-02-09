const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasTable('packages').then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable('packages', function (t) {
        t.increments(`id`) // int(10) unsigned NOT NULL AUTO_INCREMENT,
        t.string(`uuid`) // varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
        t.text(`course_id`) // int(10) unsigned NOT NULL,
        t.text(`variation`) // longtext COLLATE utf8mb4_unicode_ci NOT NULL,
        t.text(`description`) // longtext COLLATE utf8mb4_unicode_ci NOT NULL,
        t.integer(`has_coaching`) // tinyint(4) NOT NULL DEFAULT 0,
        t.integer(`manuscripts_count`) // int(11) NOT NULL DEFAULT 0,
        t.decimal(`full_payment_price`, 11, 2) // decimal(11,2) NOT NULL,
        t.decimal(`months_3_price`, 11, 2) // decimal(11,2) NOT NULL,
        t.decimal(`months_6_price`, 11, 2) // decimal(11,2) NOT NULL,
        t.decimal(`months_12_price`, 11, 2) // decimal(11,2) NOT NULL,
        t.string(`full_price_product`) // varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`months_3_product`) // varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`months_6_product`) // varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.string(`months_12_product`) // varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
        t.integer(`full_price_due_date`) // int(11) NOT NULL,
        t.integer(`months_3_due_date`) // int(11) NOT NULL,
        t.integer(`months_6_due_date`) // int(11) NOT NULL,
        t.integer(`months_12_due_date`) // int(11) NOT NULL,
        t.integer(`workshops`) // int(11) DEFAULT 0,
        t.integer(`full_payment_sale_price`) // int(11) DEFAULT NULL,
        t.date(`full_payment_sale_price_from`) // date DEFAULT NULL,
        t.date(`full_payment_sale_price_to`) // date DEFAULT NULL,
        t.integer(`months_3_sale_price`) // int(11) DEFAULT NULL,
        t.date(`months_3_sale_price_from`) // date DEFAULT NULL,
        t.date(`months_3_sale_price_to`) // date DEFAULT NULL,
        t.integer(`months_6_sale_price`) // int(11) DEFAULT NULL,
        t.date(`months_6_sale_price_from`) // date DEFAULT NULL,
        t.date(`months_6_sale_price_to`) // date DEFAULT NULL,
        t.integer(`months_12_sale_price`) // int(11) DEFAULT NULL,
        t.date(`months_12_sale_price_from`) // date DEFAULT NULL,
        t.date(`months_12_sale_price_to`) // date DEFAULT NULL,
        t.integer(`months_3_enable`) // tinyint(4) NOT NULL DEFAULT 1,
        t.integer(`months_6_enable`) // tinyint(4) NOT NULL DEFAULT 1,
        t.integer(`months_12_enable`) // tinyint(4) NOT NULL DEFAULT 0,
        t.decimal(`full_payment_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_3_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_6_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_12_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`full_payment_standard_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_3_standard_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_6_standard_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.decimal(`months_12_standard_upgrade_price`, 11, 2) // decimal(11,2) DEFAULT NULL,
        t.integer(`course_type`) // tinyint(4) NOT NULL,
        t.date(`disable_upgrade_price_date`) // date DEFAULT NULL,
        t.integer(`disable_upgrade_price`, 11, 2) // tinyint(4) DEFAULT NULL,
        t.integer(`has_student_discount`) // tinyint(4) NOT NULL DEFAULT 1,
        t.integer(`is_reward`) // tinyint(4) NOT NULL DEFAULT 0,
        t.date(`issue_date`) // date DEFAULT NULL,
        t.integer(`validity_period`) // tinyint(4) NOT NULL DEFAULT 0,
        t.text(`created_at`) // timestamp NULL DEFAULT NULL,
        t.text(`updated_at`) // timestamp NULL DEFAULT NULL,
      }).then(function () {
        log.info('Migrate packages to latest : success')
      }).catch(function (err) {
        console.log(err)
        log.error(err)
        throw err // throw error so it won't add in knex_migrations table
      })
    } else {
      let err = 'packages exist'
      log.error(err)
    }
  })
}

exports.down = async function (knex) {
  await knex.schema.hasTable('packages').then(async (exists) => {
    if (exists) {
      await knex.schema.dropTable('packages').then(function () {
        log.info('Migrate packages rollback successfuly')
      }).catch(function (err) {
        log.error('Migrated packages rollback error:' + err)
      })
    }
  })
}
