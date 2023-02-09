'use strict'
const path = require('path')

const { CoursesTaken, Course, User } = require(path.join(__dirname, '..', 'models'))

class CourseController {
  static async getAllByUserId (param) {
    let courseTaken = CoursesTaken.query()
      .where('user_id', param.userID)
      .withGraphJoined('package')
      .withGraphJoined('course')
      .whereNotNull('course.uuid')
      .groupBy('course.id')
    if (param.limit) {
      courseTaken.limit(param.limit)
    }
    return courseTaken
  }

  static getByCourseId (courseId) {
    let course = Course.query()
      .findById(courseId)
    return course
  }

  static getByCourseUUID (courseUUID) {
    let course = Course.query()
      .where('uuid', courseUUID)
    return course
  }

  static async save (data) {
    const saveCourse = await Course.query().upsertGraph([data]).first()
    return this.getByCourseUUID(saveCourse.uuid)
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    const courseTaken = await this.getAllByUserId({userID: user.uuid})
    var courseUUIDs = []

    for (let i = 0; i < courseTaken.length; i++) {
      if (courseTaken[i].course) courseUUIDs.push(courseTaken[i].course.uuid)
    }
    const rows = await Course.query()
      .whereIn('uuid', courseUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    let columns = {
      uuid: row.uuid,
      title: row.title,
      description: row.description,
      short_description: row.short_description,
      image: row.image,
      type: row.type,
      email: row.email,
      course_plan: row.course_plan,
      course_plan_data: row.course_plan_data,
      instructor: row.instructor,
      start_date: row.start_date,
      end_date: row.end_date,
      extend_courses: row.extend_courses,
      display_order: row.display_order,
      for_sale: row.for_sale,
      status: row.status,
      is_free: row.is_free,
      auto_list_id: row.auto_list_id,
      photographer: row.photographer,
      hide_price: row.hide_price,
      student_discount: row.student_discount,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
    var data = await Course.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Course.query().insert(columns)
      // update uuid to match web
      data = await Course.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  CourseController: CourseController
}
