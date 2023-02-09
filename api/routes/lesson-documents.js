'use strict'
const path = require('path')
const express = require('express')
const router = express.Router()

const { LessonDocumentController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/syncable', async function (req, res) {
  const rows = await LessonDocumentController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await LessonDocumentController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
