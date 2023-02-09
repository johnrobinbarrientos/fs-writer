'use strict'
const path = require('path')

const { Lesson, User, CoursesTaken } = require(path.join(__dirname, '..', 'models'))

class LessonController {
  static async getAllByCourseId (param) {
    let lessons = Lesson.query()
      .where('course_id', param.courseID)
      .withGraphJoined('lesson_documents')
    if (param.limit) {
      lessons.limit(param.limit)
    }
    return lessons
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await CoursesTaken.query()
      .withGraphJoined('course')
      .where('user_id', user.uuid)
      .whereNotNull('course.uuid')
    // .whereNull('books.deleted_at')
    // .where('books.updated_at', '>', user.synced_at)

    var coursesUUIDs = []

    for (let i = 0; i < courseTaken.length; i++) {
      coursesUUIDs.push(courseTaken[i].course.uuid)
    }

    const rows = await Lesson.query()
      .whereIn('course_id', coursesUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    let columns = {
      uuid: row.uuid,
      course_id: row.course_id,
      title: row.title,
      content: row.content,
      delay: row.delay,
      order: row.order,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
    var data = await Lesson.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Lesson.query().insert(columns)
      // update uuid to match web
      data = await Lesson.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  LessonController
}
