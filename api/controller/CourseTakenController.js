'use strict'
const path = require('path')

const { CoursesTaken, Course, User } = require(path.join(__dirname, '..', 'models'))

class CourseTakenController {
  static async getAllByUserId (param) {
    let courseTaken = CoursesTaken.query()
      .where('courses_taken.user_id', param.userID)
      .where('package:course:webinars:webinar_registrant.user_id', param.userID)
      .withGraphJoined('package.course.[lessons, webinars.[webinar_registrant, webinar_presenters]]')
      .modifyGraph('package.course.lessons', builder => {
        builder.orderBy('order', 'asc')
      })
      .modifyGraph('package.course', builder => {
        builder.groupBy('id')
      })
      .modifyGraph('package.course.webinars', builder => {
        builder.whereNull('deleted_at')
      })
      .modifyGraph('package.course.webinars.webinar_registrant', builder => {
        builder.limit(1).first()
      })

    if (param.limit) {
      courseTaken.limit(param.limit)
    }

    return courseTaken
  }

  static async getAllAssignmentByUserId (param) {
    var course = CoursesTaken.query()
      .where('user_id', param.userID)
      .withGraphJoined('package')
      .withGraphJoined('course')

    return course
  }

  static getCourseTakenById (courseTakenId) {
    let courseTaken = CoursesTaken.query()
      .withGraphJoined('package.course.[lessons, webinars.webinar_presenters]')
      .modifyGraph('package.course', builder => {
        builder.groupBy('id')
      })
      .modifyGraph('package.course.webinars', builder => {
        builder.whereNull('deleted_at')
      })
      .findById(courseTakenId)
    return courseTaken
  }

  static getByCourseUUID (courseUUID) {
    let courseTaken = CoursesTaken.query()
      .withGraphJoined('package')
      .withGraphJoined('course')
      .where('uuid', courseUUID)
    return courseTaken
  }

  static async save (data) {
    const saveCourseTaken = await CoursesTaken.query().upsertGraph([data]).first()
    return this.getByCourseUUID(saveCourseTaken.uuid)
  }

  static async delete (courseId) {
    const course = await Course.query().softDeleteById(courseId)

    return course
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await CoursesTaken.query()
      .select('uuid')
      .where('user_id', user.uuid)
      // .whereNull('books.deleted_at') // no deleted_at column
      .where('updated_at', '>', user.synced_at)

    return courseTaken
  }

  static async sync (row) {
    let columns = {
      uuid: row.uuid,
      user_id: row.user_id,
      package_id: row.package_id,
      is_active: row.is_active,
      started_at: row.started_at,
      start_date: row.start_date,
      end_date: row.end_date,
      access_lessons: row.access_lessons,
      years: row.years,
      sent_renew_email: row.sent_renew_email,
      is_free: row.is_free,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
    var data = await CoursesTaken.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await CoursesTaken.query().insert(columns)
      // update uuid to match web
      data = await CoursesTaken.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  CourseTakenController: CourseTakenController
}
