'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { ChapterVersionController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const version = await ChapterVersionController.save(req.body)

  res
    .status(200)
    .json(version)
})

router.get('/syncable', async function (req, res) {
  const rows = await ChapterVersionController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await ChapterVersionController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.post('/comment', async function (req, res) {
  const row = await ChapterVersionController.comment(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
