'use strict'
const path = require('path')
const { app } = require('electron')
const electronFs = require('fs')
const express = require('express')
const router = express.Router()

const { CourseTakenController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const courseTaken = await CourseTakenController.save(req.body)

  res
    .status(200)
    .json(courseTaken)
})

router.delete('/:courseId', async function (req, res) {
  const courseTaken = await CourseTakenController.delete(req.params.courseId)

  res
    .status(200)
    .json(courseTaken)
})

router.get('/syncable', async function (req, res) {
  const rows = await CourseTakenController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await CourseTakenController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/:courseTakenId', async function (req, res) {
  const courseTaken = await CourseTakenController.getCourseTakenById(req.params.courseTakenId)

  var file = path.join(resourcePath, 'resources', 'images', 'courses', courseTaken.package.course.image.replace('/uploads/course-images/', ''))

  courseTaken.package.course.picture_src = 'file://' + path.resolve(app.getAppPath(), '../', 'src', 'assets', 'img', 'default-image.jpg')
  if (electronFs.existsSync(file)) {
    courseTaken.package.course.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'courses', courseTaken.package.course.image.replace('/uploads/course-images/', ''))
  }

  courseTaken.package.course.webinars.forEach(function (webinar, indx) {
    var web_file = path.join(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))

    courseTaken.package.course.webinars[indx].image_src = 'file://' + path.resolve(app.getAppPath(), '../', 'src', 'assets', 'img', 'default-image.jpg')
    if (electronFs.existsSync(web_file)) {
      courseTaken.package.course.webinars[indx].image_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'webinars', webinar.image.replace('/uploads/webinars/', ''))
    }
  })

  res
    .status(200)
    .json(courseTaken)
})

module.exports = router
