'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { BookSceneHistoryController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const sceneHistory = await BookSceneHistoryController.save(req.body)

  res
    .status(200)
    .json(sceneHistory)
})

module.exports = router
