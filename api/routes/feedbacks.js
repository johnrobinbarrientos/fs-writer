'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { FeedbackController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/update-status', async function (req, res) {
  const feedback = await FeedbackController.updateStatus(req.body)

  res
    .status(200)
    .json(feedback)
})

router.post('/seen', async function (req, res) {
  const feedback = await FeedbackController.markSeen(req.body)

  res
    .status(200)
    .json(feedback)
})

router.post('/', async function (req, res) {
  const feedback = await FeedbackController.save(req.body)

  res
    .status(200)
    .json(feedback)
})

router.delete('/:ID', async function (req, res) {
  const feedback = await FeedbackController.delete(req.params.ID)

  res
    .status(200)
    .json(feedback)
})

router.get('/syncable', async function (req, res) {
  const rows = await FeedbackController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.get('/book/:chapterId', async function (req, res) {
  const rows = await FeedbackController.getAllFeedbacksByBookId(req.params.chapterId)

  res
    .status(200)
    .json(rows)
})

router.get('/chapter/:chapterId', async function (req, res) {
  const rows = await FeedbackController.getAllFeedbacksByChapterId(req.params.chapterId)

  res
    .status(200)
    .json(rows)
})

router.get('/scene/:chapterId', async function (req, res) {
  const rows = await FeedbackController.getAllFeedbacksBySceneId(req.params.chapterId)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await FeedbackController.sync(req.body)

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
