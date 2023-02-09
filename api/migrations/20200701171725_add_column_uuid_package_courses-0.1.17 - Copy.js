const log = require('electron-log')
exports.up = async function (knex) {
  await knex.schema.hasColumn('package_courses', 'uuid').then(async (exists) => {
    if (!exists) {
      await knex.schema.table('package_courses', function (table) {
        table.text('uuid')
      }).then(function () {
        log.info('Migration package_courses uuid new column comments : success')
      }).catch(function (err) {
        log.error('Migration package_courses uuid new column comments  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
