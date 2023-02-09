'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AuthorPersonalProgressController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const personalProgress = await AuthorPersonalProgressController.save(req.body)

  res
    .status(200)
    .json(personalProgress)
})

router.get('/syncable', async function (req, res) {
  const rows = await AuthorPersonalProgressController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await AuthorPersonalProgressController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
