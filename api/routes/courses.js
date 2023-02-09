'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()

const { CourseController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const course = await CourseController.save(req.body)

  res
    .status(200)
    .json(course)
})

router.delete('/:courseId', async function (req, res) {
  const course = await CourseController.delete(req.params.courseId)

  res
    .status(200)
    .json(course)
})

router.get('/syncable', async function (req, res) {
  const rows = await CourseController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await CourseController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/:courseId', async function (req, res) {
  const course = await CourseController.getByCourseId(req.params.courseId)

  if (course.image) {
    course.image = 'file://' + path.resolve(resourcePath, 'resources', course.image)
  }

  res
    .status(200)
    .json(course)
})

router.get('/:userID/course-list-dashboard', async function (req, res) {
  const param = {
    userID: req.params.userID,
    search: '',
    limit: 3
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const courses = await CourseController.getAllByUserId(param)
  courses.forEach(function (course, index) {
    courses[index].picture_src = ''
    if (course.pictures) {
      courses[index].picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'courses', course.pictures)
    }
  })

  res
    .status(200)
    .json(courses)
})

router.get('/:userID/course-listing', async function (req, res) {
  const param = {
    userID: req.params.userID,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const courses = await CourseController.getAllByUserId(param)
  courses.forEach(function (course, index) {
    courses[index].picture_src = ''
    if (course.pictures) {
      courses[index].picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'courses', course.pictures)
    }
  })

  res
    .status(200)
    .json(courses)
})

module.exports = router
