'use strict'
const path = require('path')

const express = require('express')
const router = express.Router()

const { RelationDetailController } = require(path.join(__dirname, '..', 'controllers'))

router.post('/', async function (req, res) {
  const relationDetail = await RelationDetailController.save(req.body)

  if (relationDetail.character_relation.picture) {
    relationDetail.character_relation.picture_src = 'file://' + path.resolve(resourcePath, 'resources', 'images', 'characters', relationDetail.character_relation.picture)
  }

  res
    .status(200)
    .json(relationDetail)
})

router.delete('/:relationDetailId', async function (req, res) {
  const relationDetail = await RelationDetailController.delete(req.params.relationDetailId)

  res
    .status(200)
    .json(relationDetail)
})

router.get('/syncable', async function (req, res) {
  const rows = await RelationDetailController.getSyncable(req.query.userID)

  res
    .status(200)
    .json(rows)
})

router.post('/sync', async function (req, res) {
  const row = await RelationDetailController.sync(req.body)

  res
    .status(200)
    .json(row)
})

module.exports = router
