'use strict'
const path = require('path')
const moment = require('moment')

const { AssignmentManuscript, User } = require(path.join(__dirname, '..', 'models'))

class AssignmentManuscriptController {
  static async getAssignmentManuscript (assignmentUuid) {
    const assignmentManuscript = await AssignmentManuscript.query()
      .whereNull('deleted_at')
      .where('assignment_id', assignmentUuid).first()

    return assignmentManuscript
  }
  static async save (data) {
    if (data.updated_at !== 'undefined' && data.updated_at !== null) {
      data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss').toString()
    }

    const saveAssignmentManuscript = await AssignmentManuscript.query().upsertGraph([data]).first()

    const assignmentManuscript = AssignmentManuscript.query()
      .findById(saveAssignmentManuscript.uuid)

    return assignmentManuscript
  }
  static async delete (manuscriptId) {
    const assignmentManuscript = await AssignmentManuscript.query().deleteById(manuscriptId)

    return assignmentManuscript
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const rows = await AssignmentManuscript.query()
      .where('user_id', userId)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    var columns = {
      uuid: row.uuid,
      assignment_id: row.assignment_id,
      user_id: row.user_id,
      content: row.content,
      words: row.words,
      grade: row.grade,
      genre: row.genre,
      where_in_script: row.where_in_script,
      locked: row.locked,
      text_number: row.text_number,
      editor_id: row.editor_id,
      has_feedback: row.has_feedback,
      join_group: row.join_group,
      is_file: row.is_file,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at
    }

    var data = await AssignmentManuscript.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await AssignmentManuscript.query().insert(columns)

      // update uuid to match web
      data = await AssignmentManuscript.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  AssignmentManuscriptController
}
