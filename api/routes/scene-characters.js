'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { SceneCharacterController } = require(path.join(__dirname, '..', 'controllers'))

router.delete('/:sceneCharacterId', async function (req, res) {
  const sceneCharacter = await SceneCharacterController.delete(req.params.sceneCharacterId)

  res
    .status(200)
    .json(sceneCharacter)
})

router.post('/batch', async function (req, res) {
  const sceneCharacter = await SceneCharacterController.saveBatch(req.body)

  res
    .status(200)
    .json(sceneCharacter)
})

router.post('/', async function (req, res) {
  const sceneCharacter = await SceneCharacterController.save(req.body)

  res
    .status(200)
    .json(sceneCharacter)
})

router.get('/syncable', async function (req, res) {
  const rows = await SceneCharacterController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await SceneCharacterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
