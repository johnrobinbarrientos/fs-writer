'use strict'
const path = require('path')

const express = require('express')
const moment = require('moment')
const router = express.Router()

const { AssignmentController, PackageController, AssignmentManuscriptController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:userId', async function (req, res) {
  let data = {
    userId: req.params.userId
  }

  const packages = await PackageController.getUserPackages(data)
  const assignments = await AssignmentController.getUserAssignments(data)

  let result = []

  async function asyncForEach (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  await asyncForEach(assignments, async (assignment) => {
    if (isNaN(assignment.submission_date)) {
      assignment.submission_date = moment(assignment.submission_date).format('YYYY-MM-DD').toString()
    } else {
      assignment.submission_date = moment(assignment.course_started_at).add(assignment.submission_date, 'day').format('YYYY-MM-DD').toString()
    }

    if (moment(assignment.submission_date).isBefore(moment().format('YYYY-MM-DD').toString())) {
      return false
    }

    let assignmentManuscript = await AssignmentManuscriptController.getAssignmentManuscript(assignment.uuid)

    if (assignment.allowed_package === '[]' || assignment.allowed_package === null) {
      assignment.assignment_manuscript = assignmentManuscript
      result.push(assignment)
    } else {
      let allowedPackages = JSON.parse(assignment.allowed_package)

      let isAllowed = false
      packages.forEach(function (pack, index) {
        if (allowedPackages != null && allowedPackages.includes(pack.id)) {
          isAllowed = true
        }
      })

      if (isAllowed === true) {
        assignment.assignment_manuscript = assignmentManuscript
        result.push(assignment)
      }
    }
  })

  res
    .status(200)
    .json(result)
})

router.post('/sync', async function (req, res) {
  const row = await AssignmentController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
