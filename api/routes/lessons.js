'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()

const { LessonController } = require(path.join(__dirname, '..', 'controllers'))

// router.post('/', async function (req, res) {
//   const lesson = await LessonController.save(req.body)
//
//   if (lesson.pictures) {
//     lesson.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'lessons', lesson.pictures)
//   }
//
//   res
//     .status(200)
//     .json(lesson)
// })
//
// router.delete('/:lessonId', async function (req, res) {
//   const lesson = await LessonController.delete(req.params.lessonId)
//
//   res
//     .status(200)
//     .json(lesson)
// })

router.get('/syncable', async function (req, res) {
  const rows = await LessonController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await LessonController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/:courseID', async function (req, res) {
  const param = {
    courseID: req.params.courseID,
    search: ''
  }

  if (req.query.search) {
    param.search = req.query.search
  }

  const lessons = await LessonController.getAllByCourseId(param)

  res
    .status(200)
    .json(lessons)
})

module.exports = router
