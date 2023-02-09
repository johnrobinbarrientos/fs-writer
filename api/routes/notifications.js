'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { NotificationController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:authorUuid', async function (req, res) {
  const data = await NotificationController.getAll(req.params.authorUuid)
  const response = {
    'count': data.length,
    'rows': data
  }
  res
    .status(200)
    .json(response)
})

router.post('/', async function (req, res) {
  const data = await NotificationController.save(req.body)

  res
    .status(200)
    .json(data)
})

router.get('/read/:notificationId', async function (req, res) {
  const row = await NotificationController.read(req.params.notificationId)
  res
    .status(200)
    .json(row)
})

module.exports = router
