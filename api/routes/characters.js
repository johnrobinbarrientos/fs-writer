'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { CharacterController, RelationDetailController } = require(path.join(__dirname, '..', 'controllers'))

router.get('/:characterId/relations', async function (req, res) {
  const relationDetail = await RelationDetailController.getRelationDetailByCharacterId(req.params.characterId)

  relationDetail.forEach(function (item, index) {
    if (item.character_relation.picture) {
      relationDetail[index].character_relation.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', item.character_relation.picture)
    }
  })

  res
    .status(200)
    .json(relationDetail)
})

router.post('/', async function (req, res) {
  const character = await CharacterController.save(req.body)
  if (character.picture) {
    character.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', character.picture)
  }

  res
    .status(200)
    .json(character)
})

router.delete('/:characterId', async function (req, res) {
  const character = await CharacterController.delete(req.params.characterId)

  res
    .status(200)
    .json(character)
})

router.get('/syncable', async function (req, res) {
  const rows = await CharacterController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await CharacterController.sync(req.body)

  res
    .status(200)
    .json(row)
})

router.get('/:characterId', async function (req, res) {
  const character = await CharacterController.getByCharacterId(req.params.characterId)

  if (character.picture) {
    character.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', character.picture)
  }

  res
    .status(200)
    .json(character)
})

module.exports = router
