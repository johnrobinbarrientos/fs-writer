'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { BookChapterHistoryController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const chapterHistory = await BookChapterHistoryController.save(req.body)

  res
    .status(200)
    .json(chapterHistory)
})

module.exports = router
