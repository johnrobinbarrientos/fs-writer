'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneLocationController } = require(path.join(__dirname, '..', 'controllers'))

router.delete('/:sceneLocationId', async function (req, res) {
  const sceneCLocation = await SceneLocationController.delete(req.params.sceneLocationId)

  res
    .status(200)
    .json(sceneCLocation)
})

router.post('/batch', async function (req, res) {
  const sceneLocation = await SceneLocationController.saveBatch(req.body)

  res
    .status(200)
    .json(sceneLocation)
})

router.post('/', async function (req, res) {
  const sceneLocation = await SceneLocationController.save(req.body)

  res
    .status(200)
    .json(sceneLocation)
})

router.get('/syncable', async function (req, res) {
  const rows = await SceneLocationController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await SceneLocationController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
