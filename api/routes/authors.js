'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { AuthorPersonalProgressController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:authorId/:isFor/:relationId/personal-progress/:date', async function (req, res) {
  let data = {
    authorId: req.params.authorId,
    relationId: req.params.relationId,
    isFor: req.params.isFor,
    date: req.params.date
  }

  const personalProgress = await AuthorPersonalProgressController.getAuthorPersonalProgress(data)

  res
    .status(200)
    .json(personalProgress)
})

router.get('/:authorId/personal-progress', async function (req, res) {
  let personalProgress = {
    today: 0,
    monthly: 0,
    yearly: 0,
    all_time: 0
  }

  let today = await AuthorPersonalProgressController.getAuthorPersonalProgressWordsCount(req.params.authorId, 'today')
  if (today.words_count) {
    personalProgress.today = today.words_count
  }

  let monthly = await AuthorPersonalProgressController.getAuthorPersonalProgressWordsCount(req.params.authorId, 'monthly')
  if (monthly.words_count) {
    personalProgress.monthly = monthly.words_count
  }

  let yearly = await AuthorPersonalProgressController.getAuthorPersonalProgressWordsCount(req.params.authorId, 'yearly')
  if (yearly.words_count) {
    personalProgress.yearly = yearly.words_count
  }

  let allTime = await AuthorPersonalProgressController.getAuthorPersonalProgressWordsCount(req.params.authorId, 'all')
  if (allTime.words_count) {
    personalProgress.all_time = allTime.words_count
  }

  res
    .status(200)
    .json(personalProgress)
})

module.exports = router
