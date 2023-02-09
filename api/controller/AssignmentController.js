'use strict'
const path = require('path')
const moment = require('moment')
// const { raw } = require('objection')

const { Assignment } = require(path.join(__dirname, '..', 'models'))

class AssignmentController {
  static async getUserAssignments (data) {
    // , raw('( SELECT assignment_manuscripts.* FROM assignment_manuscripts WHERE assignment_manuscripts.assignment_id = assignments.uuid )').as('assignment_manuscripts')
    const queryBuilder = Assignment.query()
      .select('assignments.*', 'courses.title as course_title', 'courses_taken.started_at as course_started_at')
      .join('courses', 'courses.uuid', 'assignments.course_id')
      .join('packages', 'packages.course_id', 'courses.uuid')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', data.userId)
      .whereRaw("available_date <= '" + moment().format('YYYY-MM-DD').toString() + "' OR available_date IS NULL")
      .groupBy('assignments.id')

    let assignments = await queryBuilder.orderBy('assignments.created_at', 'DESC')

    return assignments
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      course_id: row.course_id,
      title: row.title,
      description: row.description,
      submission_date: row.submission_date,
      available_date: row.available_date,
      allowed_package: row.allowed_package,
      add_on_price: row.add_on_price,
      max_words: row.max_words,
      for_editor: row.for_editor,
      editor_manu_generate_count: row.editor_manu_generate_count,
      generated_filepath: row.generated_filepath,
      show_join_group_question: row.show_join_group_question,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: null
    }

    var data = await Assignment.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Assignment.query().insert(columns)

      // update uuid to match web
      data = await Assignment.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  AssignmentController
}
