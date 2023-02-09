'use strict'
const path = require('path')

const { CoursesTaken, Package, User } = require(path.join(__dirname, '..', 'models'))

class PackageController {
  static async getUserPackages (data) {
    let packages = await Package.query()
      .select('packages.id')
      .join('courses_taken', 'courses_taken.package_id', 'packages.uuid')
      .where('courses_taken.user_id', data.userId)
      .groupBy('packages.id')

    return packages
  }

  static async getSyncable (userId) {
    const user = await User.query()
      .findById(userId)
      .withGraphJoined('author', { maxBatchSize: 1 })

    let courseTaken = await CoursesTaken.query()
      .where('user_id', user.uuid)
      .withGraphJoined('course')

    var courseUUIDs = []
    for (let i = 0; i < courseTaken.length; i++) {
      if (courseTaken[i].course) courseUUIDs.push(courseTaken[i].course.uuid)
    }

    const rows = await Package.query()
      .whereIn('course_id', courseUUIDs)
      .where('updated_at', '>', user.synced_at)

    return rows
  }

  static async sync (row) {
    let columns = {
      uuid: row.uuid,
      course_id: row.course_id,
      variation: row.description,
      description: row.short_description,
      has_coaching: row.image,
      manuscripts_count: row.type,
      full_payment_price: row.email,
      months_3_price: row.course_plan,
      months_6_price: row.course_plan_data,
      months_12_price: row.instructor,
      full_price_product: row.start_date,
      months_3_product: row.end_date,
      months_6_product: row.extend_courses,
      months_12_product: row.display_order,
      full_price_due_date: row.for_sale,
      months_3_due_date: row.status,
      months_6_due_date: row.is_free,
      months_12_due_date: row.auto_list_id,
      workshops: row.photographer,
      full_payment_sale_price: row.hide_price,
      full_payment_sale_price_from: row.student_discount,
      full_payment_sale_price_to: row.created_at,
      months_3_sale_price: row.created_at,
      months_3_sale_price_from: row.created_at,
      months_3_sale_price_to: row.created_at,
      months_6_sale_price: row.created_at,
      months_6_sale_price_from: row.created_at,
      months_6_sale_price_to: row.created_at,
      months_12_sale_price: row.created_at,
      months_12_sale_price_from: row.created_at,
      months_12_sale_price_to: row.created_at,
      months_3_enable: row.created_at,
      months_6_enable: row.created_at,
      months_12_enable: row.created_at,
      full_payment_upgrade_price: row.created_at,
      months_3_upgrade_price: row.created_at,
      months_6_upgrade_price: row.created_at,
      months_12_upgrade_price: row.created_at,
      full_payment_standard_upgrade_price: row.created_at,
      months_3_standard_upgrade_price: row.created_at,
      months_6_standard_upgrade_price: row.created_at,
      months_12_standard_upgrade_price: row.created_at,
      course_type: row.created_at,
      disable_upgrade_price_date: row.created_at,
      disable_upgrade_price: row.created_at,
      has_student_discount: row.created_at,
      is_reward: row.updated_at,
      issue_date: row.updated_at,
      validity_period: row.updated_at,
      created_at: row.updated_at,
      updated_at: row.updated_at
    }
    var data = await Package.query()
      .patch(columns)
      .where('uuid', '=', row.uuid)

    if (!data || data === 0) {
      data = await Package.query().insert(columns)
      // update uuid to match web
      data = await Package.query()
        .patch({ 'uuid': row.uuid, created_at: row.created_at, updated_at: row.updated_at })
        .where('uuid', '=', data.uuid)
    }

    return data
  }
}

module.exports = {
  PackageController
}
