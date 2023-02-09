'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { FeedbackResponseController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const character = await FeedbackResponseController.save(req.body)

  res
    .status(200)
    .json(character)
})

router.delete('/:ID', async function (req, res) {
  const feedbackResponse = await FeedbackResponseController.delete(req.params.ID)

  res
    .status(200)
    .json(feedbackResponse)
})

router.get('/syncable', async function (req, res) {
  const rows = await FeedbackResponseController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await FeedbackResponseController.sync(req.body)

  res
    .status(200)
    .json(row)
})
/*
router.get('/:readerID', async function (req, res) {
  const reader = await ReaderController.getByReader(req.params.readerID)

  res
    .status(200)
    .json(reader)
})
*/
module.exports = router
