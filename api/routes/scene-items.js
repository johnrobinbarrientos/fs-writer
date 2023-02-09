'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneItemController } = require(path.join(__dirname, '..', 'controllers'))

router.delete('/:sceneItemId', async function (req, res) {
  const sceneItem = await SceneItemController.delete(req.params.sceneItemId)

  res
    .status(200)
    .json(sceneItem)
})

router.post('/batch', async function (req, res) {
  const sceneItem = await SceneItemController.saveBatch(req.body)

  res
    .status(200)
    .json(sceneItem)
})

router.post('/', async function (req, res) {
  const sceneItem = await SceneItemController.save(req.body)

  res
    .status(200)
    .json(sceneItem)
})

router.get('/syncable', async function (req, res) {
  const rows = await SceneItemController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await SceneItemController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
