const log = require('electron-log')
exports.up = async function (knex) {
  // book_locations
  await knex.schema.hasTable('book_locations').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_locations', function (table) {
        table.integer('picture_modified')
      }).then(function () {
        log.info('Migration book_locations new column picture_modified : success')
      }).catch(function (err) {
        log.error('Migration book_locations new column picture_modified  : error:' + err)
      })
    }
  })
  // book_items
  await knex.schema.hasTable('book_items').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_items', function (table) {
        table.integer('picture_modified')
      }).then(function () {
        log.info('Migration book_locations new column picture_modified : success')
      }).catch(function (err) {
        log.error('Migration book_locations new column picture_modified  : error:' + err)
      })
    }
  })
  // book_characters
  await knex.schema.hasTable('book_characters').then(async (exists) => {
    if (exists) {
      await knex.schema.table('book_characters', function (table) {
        table.integer('picture_modified')
      }).then(function () {
        log.info('Migration book_locations new column picture_modified : success')
      }).catch(function (err) {
        log.error('Migration book_locations new column picture_modified  : error:' + err)
      })
    }
  })
}

exports.down = async function (knex) {}
